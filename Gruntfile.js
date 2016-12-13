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
          dest: 'tmp/babel'
        }]
      }
    },
    concat: {
      dist: {
        src: 'tmp/babel/**/*.js',
        dest: 'tmp/concat/tempart.js'
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
      src: {
        files: [
          'src/*',
          'src/*/*'
        ],
        tasks: ['babel', 'build']
      },
      babel: {
        files: [
          'tmp/babel/*',
          'tmp/babel/*/*',
        ],
        tasks: ['build']
      }
    },
    amdclean: {
      dist: {
        src: 'tmp/concat/tempart.js',
        dest: 'tmp/concat/tempart.js',
      }
    },
    'string-replace': {
      dist: {
        files: [{
          src: 'tmp/concat/tempart.js',
          dest: 'dist/tempart.js'
        }],
        options: {
          replacements: [{
            pattern: '}());',
            replacement: grunt.file.read('src/tempart.js') + '}());'
          }]
        }
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
  grunt.registerTask('build', ['concat', 'amdclean', 'string-replace']);
  grunt.registerTask('default', ['githooks', 'touch', 'babel', 'build']);
  grunt.registerTask('min', ['clean', 'default', 'uglify']);
};

