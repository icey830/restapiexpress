/**
 * Created by Samuel Schmid on 06.06.14.
 *
 * Class for writing pre- and post-conditions for tests
 *
 * @type {PrePostConditionTestWriter}
 */
module.exports = PrePostConditionTestWriter;

/**
 *
 * @param grunt
 * @param rootdir
 * @param integrationTestWriter
 * @constructor
 */
function PrePostConditionTestWriter(grunt, rootdir, integrationTestWriter) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.integrationTestWriter = integrationTestWriter;
}

/**
 * write a pre- and post-condition for given apidoc
 *
 * @param doc
 * @param docs
 */
PrePostConditionTestWriter.prototype.write = function (doc, docs) {
    this.docs = docs;
    var grunt = this.grunt;
    var fullModel = doc.readModel();

    writePreCondition(this, grunt, doc, fullModel);

    writePostCondition(this, grunt, doc, fullModel);
}

function writePreCondition(scope, grunt, doc, fullModel) {

    var test = grunt.file.read('./grunt/templates/test.template');

    var hasMandatoryReference = false;

    //Create mandatory references
    Object.keys(fullModel).forEach(function(model) {

        if(fullModel[model].mandatory === false) return;

        if(fullModel[model].reference) {
            hasMandatoryReference = true;
            var type = doc.json.model[model].type.split("/")[1];

            if(type.endsWith("[]")) {
                type = type.replace("[]","");
                var ids =  doc.json.model[model].test;
                ids.forEach(function(id) {
                    test = scope.integrationTestWriter.getCreateEntityContent(id,type,test, "create mandatory reference");
                });
            } else {
                var id = doc.json.model[model].test;
                test = scope.integrationTestWriter.getCreateEntityContent(id,type, test, "create mandatory reference");
            }
        }
    });

    if(hasMandatoryReference) grunt.file.write(doc.testfolder + '/jprecondtion.js', test);

}

function writePostCondition(scope, grunt, doc, fullModel) {

    //NO POST Condition needed at the moment
    return;


    var test = grunt.file.read('./grunt/templates/test.template');
    var hasMandatoryReference = false;
    //Delete created Reference
    Object.keys(fullModel).forEach(function(model) {

        if(fullModel[model].reference) {
            hasMandatoryReference = true;
            var type = doc.json.model[model].type.split("/")[1];

            if(type.endsWith("[]")) {
                type = type.replace("[]","");
                var ids =  doc.json.model[model].test;
                ids.forEach(function(id) {
                    test = scope.integrationTestWriter.getDeleteEntityContent(id,type,test, "Delete as Postcondition");
                });
            } else {
                var id = doc.json.model[model].test;
                test = scope.integrationTestWriter.getDeleteEntityContent(id,type, test,"Delete as Postcondition");
            }
        }
    });

    if(hasMandatoryReference) grunt.file.write(doc.testfolder + '/zpostcondition.js', test);
}