import mockViewport from './mockViewport';

export default function mockPDFPage(width = 612, height = 792) {
  return {
    getViewport: function({scale, rotation}) {
      return mockViewport(width, height, scale, rotation);
    },

    render: function(renderOptions) {
      return {
        promise: Promise.resolve(true)
      };
    },

    getTextContent: function() {
      return Promise.resolve(true);
    }
  };
};
