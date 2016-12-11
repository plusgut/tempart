module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      options: {
        presets: ["es2015"],
        plugins: ["transform-es2015-modules-amd"],
        moduleIds: true,
        sourceRoot: 'src',
        moduleRoot: 'tempart'
      },
      all: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '*/*.js',
          dest: 'tmp'
        }]
      }
    },
    concat: {
      dist: {
        src: 'tmp/**/*.js',
        dest: 'dist/tempart.js'
      }
    },
    uglify: {
      dist: {
        src: 'dist/tempart.js',
        dest: 'dist/tempart.min.js'
      }
    },
    clean: {
      dist: {
        src: ['tmp', 'dist']
      }
    },
    touch: {
      src: ['dist/tempart.min.js']
    },
    watch: {
      scripts: {
        files: [
          'src/*',
          'src/*/*'
        ],
        tasks: ['default']
      }
    },
    amdclean: {
      dist: {
        src: 'dist/tempart.js',
        dest: 'dist/tempart.js',
      }
    },
    githooks: {
      all: {
        'pre-commit': {
          taskNames: 'min'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['githooks', 'touch', 'babel', 'concat', 'amdclean']);
  grunt.registerTask('min', ['clean', 'default', 'uglify']);
};

