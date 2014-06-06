/**
 * Created by Samuel Schmid on 30.03.14.
 *
 * Class for writing Test file
 *
 * writes a route tests GET Resource or collection
 *
 * @type {TestGetResourceWriter}
 */
module.exports = TestGetResourceWriter;

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function TestGetResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

TestGetResourceWriter.prototype.write = function(doc, permission, method, collectionOrEntity)  {

    if(collectionOrEntity === undefined) {
        this.writeInstance(doc,permission,method);
        this.writeCollection(doc,permission,method);
    } else if(collectionOrEntity === "collection") {
        this.writeCollection(doc,permission,method);
    } else {
        this.writeInstance(doc,permission,method);
    }

}

TestGetResourceWriter.prototype.generateJson = function(json,doc, allData) {

    for (var property in doc.json.model) {

        var path = doc.json.model[property];
        if(path.mandatory || allData) {
            if(path.hasOwnProperty("test")) {
                json[property] = path.test;
            } else {
                this.grunt.log.write("no testvalue for propert " + property + " in doument " + doc.title);
            }

        }
    }

    if(doc.base && doc.base != "none") {
        this.generateJson(json,doc.baseDoc);

    }

}

TestGetResourceWriter.prototype.getInstanceTestContent = function(testfileContent, doc, role, appJsPath, allData, removeFromJson, comment, expectDeleted) {
    var grunt = this.grunt;

    var http200 = grunt.file.read('./grunt/api/route/get/get-instance-test.template');
    testfileContent = testfileContent + '\n' + http200;

    var json = {};
    if(!expectDeleted) {
        this.generateJson(json,doc, allData);

        if(removeFromJson !== undefined) {
            grunt.log.writeln("removeFromJSON " + JSON.stringify(removeFromJson));
            var allReferenceFileds = removeFromJson.reference.split(",");
            allReferenceFileds.forEach(function(field) {

                if(field.endsWith("[]")) field = field.substr(0,field.length-2);

                grunt.log.writeln("filed " + field);
                grunt.log.writeln("filedvalue " + json[field]);

                if(json[field] instanceof Array){
                    var fieldArray = json[field];
                    grunt.log.writeln("search array for value " + removeFromJson.value + " and remove it. Arraylength " + fieldArray.length);

                    for (var i =0; i < fieldArray.length; i++) {
                        //grunt.log.writeln("value = " + fieldArray[i] + " compare to " + removeFromJson.value);

                        if (JSON.stringify(fieldArray[i]) === JSON.stringify(removeFromJson.value)) {
                            fieldArray.splice(i,1);
                            grunt.log.writeln("found at position " + i);

                        }
                    }
                } else {
                    grunt.log.writeln("noArray");
                    json[field] = null;
                }
            });
        }
    } else {
        json = undefined;
    }

    var path = '/v'+doc.version + '/' + doc.filetitle + '/' + doc.json._testId;
    var modifiedContent =  testfileContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',role);
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',appJsPath);
    modifiedContent = modifiedContent.replace("{{{JSON}}}", JSON.stringify(json));
    modifiedContent = modifiedContent.replaceAll("{{{COMMENT}}}", comment);
    return modifiedContent;

}

TestGetResourceWriter.prototype.writeInstance = function(doc,permission,method) {

    this.writeTestGetExistingResource(doc, permission, method);

}

TestGetResourceWriter.prototype.writeCollection = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',method.toLowerCase());
    var path = '/v'+doc.version + '/' + doc.filetitle + '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);

}


//private
TestGetResourceWriter.prototype.writeTestGetExistingResource = function(doc,permission,method) {
    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http400 = grunt.file.read('./grunt/templates/tests/http400.template');
    test = test + '\n' + http400;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',method.toLowerCase());
    var path = '/v'+doc.version + '/' + doc.filetitle + '/' + "123.json";
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);
}
