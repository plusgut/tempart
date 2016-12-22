// jscs:disable requireTrailingComma

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      options: {
        moduleIds: true,
        sourceRoot: 'src',
        moduleRoot: 'tempart',
      },
      all: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.js',
          dest: 'tmp/babel',
        }],
      },
    },
    concat: {
      dist: {
        src: [
          'tmp/babel/version.js',

          'tmp/babel/helpers/configs.js',
          'tmp/babel/helpers/dependency.js',
          'tmp/babel/helpers/dom.js',
          'tmp/babel/helpers/values.js',
          'tmp/babel/helpers/parameters.js',

          'tmp/babel/types/dom.js',
          'tmp/babel/types/each.js',
          'tmp/babel/types/variable.js',
          'tmp/babel/types/event.js',
          'tmp/babel/types/if.js',
          'tmp/babel/types/log.js',
          'tmp/babel/types/partial.js',
          'tmp/babel/types/text.js',
          'tmp/babel/types/variable.js',
          'tmp/babel/types/view.js',

          'tmp/babel/helpers/blocks.js',

          // @TODO these can be removed?
          'tmp/babel/compiler/public/controller.js',
          'tmp/babel/compiler/public/model.js',
          'tmp/babel/compiler/public/partial.js',
          'tmp/babel/compiler/public/view.js',

          'tmp/babel/compiler/class.js',
          'tmp/babel/compiler/compiler.js',

          'tmp/babel/parser/blockClass.js',
          'tmp/babel/parser/parser.js',
        ],
        dest: 'tmp/concat/tempart.js',
      }
    },
    uglify: {
      dist: {
        src: 'dist/tempart.js',
        dest: 'dist/tempart.min.js',
      },
    },
    clean: {
      dist: {
        src: ['tmp', 'dist']
      },
    },
    touch: {
      src: ['dist/tempart.min.js'],
    },
    watch: {
      src: {
        files: [
          'src/*',
          'src/**/*',
        ],
        tasks: ['babel', 'build'],
      },
      babel: {
        files: [
          'tmp/babel/*.js',
          'tmp/babel/**/*.js',
          'src/tempart.js',
        ],
        tasks: ['build'],
      },
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
          dest: 'dist/tempart.js',
        }],
        options: {
          replacements: [{
            pattern: '}());',
            replacement: grunt.file.read('src/tempart.js') + '}());',
          }]
        }
      }
    },
    githooks: {
      all: {
        'pre-commit': {
          taskNames: 'min',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('build', ['concat', 'amdclean', 'string-replace']);
  grunt.registerTask('default', ['githooks', 'touch', 'babel', 'build']);
  grunt.registerTask('min', ['clean', 'default', 'uglify']);
};

