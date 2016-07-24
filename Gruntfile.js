module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      options: {
        presets: ["es2015"],
        plugins: ["transform-es2015-modules-amd"],
        moduleIds: true,
        sourceRoot: 'src',
        // moduleRoot: 'snew'
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
        dest: 'dist/precompiler.js'
      }
    },
    uglify: {
      dist: {
        src: 'dist/tempart.js',
        dest: 'dist/snew.min.js'
      }
    },
    clean: {
      dist: {
        src: ['tmp', 'dist']
      }
    },
    touch: {
      src: ['dist/snew.min.js']
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
        src: 'dist/snew.js',
        dest: 'dist/snew.js',
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

