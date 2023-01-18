import { CreateUserResponse } from './interfaces/interfaces';

context('Files', () => {
  let user: CreateUserResponse['body'];
  let userFiles: CreateUserResponse['body'];
  let userComment: CreateUserResponse['body'];
  before(() => {
    cy.wait(5000);
    cy.request('POST', '/auth/login', {
      email: Cypress.env('email'),
      password: Cypress.env('password'),
    })
      .its('body')
      .then((res) => {
        user = res;
      });

    cy.request('POST', '/auth/login', {
      email: Cypress.env('userFile'),
      password: Cypress.env('password'),
    })
      .its('body')
      .then((res) => (userFiles = res));

    cy.request('POST', '/auth/login', {
      email: Cypress.env('userComment'),
      password: Cypress.env('password'),
    })
      .its('body')
      .then((res) => (userComment = res));
  });

  describe('upload', () => {
    it('Only users with required roles can upload videos', () => {
      const image = '/images/sample.png';
      const boundary = '---TestBoundaryString';
      const crlf = '\r\n';

      cy.fixture(image).then((fileContent) => {
        const body = `--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="${image}"${crlf}Content-Type: image/png${crlf}${crlf}${fileContent}${crlf}--${boundary}--`;

        cy.request({
          method: 'POST',
          url: '/file',
          auth: {
            bearer: user.token,
          },

          headers: {
            accept: '*/*',
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
        });

        cy.request({
          method: 'POST',
          url: '/file',
          auth: {
            bearer: userFiles.token,
          },

          headers: {
            accept: '*/*',
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body,
        }).then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('url');
          expect(res.body.fileType).to.be.equal('image');
          expect(res.body).to.have.property('extension');
          expect(res.body).to.have.property('description');
        });
      });
    });

    it('should let the user add a description', () => {
      const image = '/images/sample.png';
      const boundary = '---TestBoundaryString';
      const crlf = '\r\n';

      cy.fixture(image).then((fileContent) => {
        const description = 'This is a sample description';
        const body = `--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="kindness.png"${crlf}Content-Type: image/png${crlf}${crlf}${fileContent}${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="description"${crlf}${crlf}${description}${crlf}--${boundary}--`;

        cy.request({
          method: 'POST',
          url: '/file',
          auth: {
            bearer: userFiles.token,
          },
          headers: {
            accept: '*/*',
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(400);
        });

        cy.request({
          method: 'POST',
          url: '/file',
          auth: {
            bearer: userComment.token,
          },
          headers: {
            accept: '*/*',
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body).to.have.property('description');
          expect(res.body.description).to.be.equal(description);
        });
      });
    });

    it('should allow only images or videos', () => {
      const boundary = '---TestBoundaryString';
      const crlf = '\r\n';
      const video = '/videos/sample.mp4';

      cy.fixture(video).then((fileContent) => {
        const body = `--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="${video}"${crlf}Content-Type: video/mp4${crlf}${crlf}${fileContent}${crlf}--${boundary}--`;

        cy.request({
          method: 'POST',
          url: '/file',
          auth: {
            bearer: userFiles.token,
          },
          headers: {
            accept: '*/*',
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body,
        }).then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body.fileType).to.be.equal('video');
        });
      });

      const pdf = '/pdf/sample.pdf';
      cy.fixture(pdf).then((fileContent) => {
        const body = `--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="${pdf}"${crlf}Content-Type: application/pdf${crlf}${crlf}${fileContent}${crlf}--${boundary}--`;

        cy.request({
          method: 'POST',
          url: '/file',
          auth: {
            bearer: userFiles.token,
          },
          headers: {
            accept: '*/*',
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(415);
        });
      });
    });
  });

  describe('get', () => {
    it('should get all files', () => {
      cy.request({
        method: 'GET',
        url: '/file',
        auth: {
          bearer: userFiles.token,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    });

    it('should get all files with pagination', () => {
      cy.request({
        method: 'GET',
        url: '/file?take=1',
        auth: {
          bearer: userFiles.token,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(1);
      });
    });

    it('should get all files with pagination and offset', () => {
      cy.request({
        method: 'GET',
        url: '/file?take=1&skip=1',
        auth: {
          bearer: userFiles.token,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(1);
      });
    });

    it('should filter by type of file', () => {
      cy.request({
        method: 'GET',
        url: '/file?type=image',
        auth: {
          bearer: userFiles.token,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].fileType).to.be.equal('image');
      });
      cy.request({
        method: 'GET',
        url: '/file?type=video',
        auth: {
          bearer: userFiles.token,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0].fileType).to.be.equal('video');
      });
      cy.request({
        method: 'GET',
        url: '/file?take=1&skip=1&type=pdf',
        auth: {
          bearer: userFiles.token,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body).to.be.an('object');
      });
    });

    it('should get file by id', () => {
      cy.request({
        method: 'GET',
        url: '/file/1',
        auth: {
          bearer: userFiles.token,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
      cy.request({
        method: 'GET',
        url: '/file/44',
        auth: {
          bearer: userFiles.token,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
  });
});
