/**
 * Created by samschmid on 28.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function TestWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

TestWriter.prototype.writeVersionsTest = function()  {
    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;

    var modifiedContent =  test.replace('{{{METHOD}}}',"GET");
    modifiedContent =  modifiedContent.replace('{{{method}}}',"get");
    var path = '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',"public");
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',this.rootdir + '/app.js');
    grunt.file.write(this.rootdir + '/test/versions.js', modifiedContent);

}
module.exports = TestWriter;