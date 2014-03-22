/**
 * Created by samschmid on 24.02.14.
 */

var Docs = require('./grunt/docs.js');

module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appconfig: grunt.file.readJSON('config.json'),
    });



    grunt.registerTask('default', 'searchDocs', function() {

        var dependencies = grunt.config().pkg.dependencies;
        var appconfig = grunt.config().appconfig;
        //
      //  grunt.log.debug(JSON.stringify(appconfig));


        for (var key in appconfig.db.dependencies) {
            if ( appconfig.db.dependencies.hasOwnProperty(key)) {

                if(dependencies.hasOwnProperty(key)) {
                    grunt.log.debug("extension " +key +":" + JSON.stringify(appconfig.db.dependencies[key]));
                    grunt.log.debug("package * " + key +":"+ JSON.stringify(dependencies[key]));
                    //TODO install dependencies of db if newer version in config
                } else {
                    //TODO install dependencies
                    grunt.log.debug("install extension " +key +":" + JSON.stringify(appconfig.db.dependencies[key]));
                }

            }
        }

        var allDocuments = new Docs(grunt);

        for(var i=0;i<allDocuments.docs.length;i++) {
            var doc = allDocuments.docs[i];

            if(doc.json.title === 'api') {

                doc.createJsForAPI();

            } else {

                grunt.log.debug("start createing doc");
                doc.createJsForInstanceAndCollection();
                /*var instanceTargetPath = doc.folder + '_get_instance_v' + doc.version;
                var collectionTargetPath = doc.folder + '_get_collection_v' + doc.version;
                grunt.log.debug("targetI:"+instanceTargetPath);
                grunt.log.debug("targetC:"+collectionTargetPath);*/

            }

        }

        var versionArray = [];
        allDocuments.versions.forEach(function(version) {
            var selfref =
            {
                "type":"application/com.github.restapiexpress.api",
                "rel": "Version " + version,
                "method": "GET",
                "href": "http://localhost:3000/v"+version+"/"
            };
            versionArray.push(selfref);
        });

        var versionJson = {"versions" : versionArray};

        grunt.file.write(__dirname + '/api/versions.json', JSON.stringify(versionJson));

        var test = grunt.file.read('./grunt/templates/test.template');
        var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
        test = test + '\n' + http200;

        var modifiedContent =  test.replace('{{{METHOD}}}',"GET");
        modifiedContent =  modifiedContent.replace('{{{method}}}',"get");
        var path = '/';
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{path}}}',path);
        modifiedContent =  modifiedContent.replace('{{{role}}}',"public");
        modifiedContent =  modifiedContent.replace('{{{role}}}',"public");
        modifiedContent =  modifiedContent.replace('{{{appjs}}}',__dirname + '/app.js');
        grunt.file.write(__dirname + '/test/versions.js', modifiedContent);
       /* var done = this.async();
        require('child_process').exec('make test', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });*/
    });

    grunt.registerTask('test', 'test with mocha', function() {

        var done = this.async();
        require('child_process').exec('make test', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    });

    grunt.registerTask('setup', 'install extensions', function() {

        var dependencies = grunt.config().pkg.dependencies;
        var appconfig = grunt.config().appconfig;
        //
        //  grunt.log.debug(JSON.stringify(appconfig));
        var asyncTasks=[];
        for (var key in appconfig.db.dependencies) {
            if ( appconfig.db.dependencies.hasOwnProperty(key)) {

                if(dependencies.hasOwnProperty(key)) {
                    grunt.log.debug("extension " +key +":" + JSON.stringify(appconfig.db.dependencies[key]));
                    grunt.log.debug("package * " + key +":"+ JSON.stringify(dependencies[key]));
                    //TODO install dependencies of db if newer version in config
                } else {

                    var version = appconfig.db.dependencies[key];
                    if(version === "*") {
                        version = "latest";
                    }
                    asyncTasks.push(
                        {
                            cmd:'npm',
                            args: ['install', key + "@" + version]
                        }
                    );

                }

            }
        }

        var done = this.async();
        var next = function(index){
            var task = asyncTasks[index];
            grunt.log.write("\ninstall extension \n" + asyncTasks[index].args[1] );
            grunt.util.spawn(task, function(error,result) {
                grunt.log.write(result);

                if(error) {

                    done(error)
                } else {
                    if(asyncTasks.length > ++index) {

                        next(index);
                    } else {

                        done(error);
                    }
                }

            });
        }
        if(asyncTasks.length > 0) {
            var index = 0;
            next(index);

        }


    });

};