/**
 * Created by samschmid on 24.02.14.
 */

var Docs = require('./grunt/docs.js');

module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')

    });

    grunt.registerTask('default', 'searchDocs', function() {
        grunt.log.write('Logging some stuff...').ok();
        var allDocuments = new Docs(grunt);

        for(var i=0;i<allDocuments.docs.length;i++) {
            var doc = allDocuments.docs[i];

            grunt.log.debug("title:"+doc.json.title);
            if(doc.json.title === 'api') {
                grunt.log.debug("methds:"+doc.supportedMethods);
                //var apiTargetPath = doc.folder + '_get_api_v' + doc.version + '.json';
                //grunt.log.debug("targetAP:"+apiTargetPath);
                doc.createJsForAPI();
               /* doc.supportedMethods.forEach(function(method) {

                });*/

            } else {
                /*var instanceTargetPath = doc.folder + '_get_instance_v' + doc.version;
                var collectionTargetPath = doc.folder + '_get_collection_v' + doc.version;
                grunt.log.debug("targetI:"+instanceTargetPath);
                grunt.log.debug("targetC:"+collectionTargetPath);*/

            }

        }
    });

};