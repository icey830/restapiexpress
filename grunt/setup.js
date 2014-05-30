/**
 * Created by Samuel Schmid on 23.03.14.
 *
 * Class for Download grunt dependencies
 *
 * @type {Setup}
 */
module.exports = Setup;

function Setup(grunt) {
    this.grunt = grunt;
    this.package = grunt.config().pkg;
    this.appconfig = grunt.config().appconfig;
}

Setup.prototype.downloadDependencies = function(context)  {
    var dependencies = this.package.dependencies;
    var appconfig = this.appconfig;
    var grunt = this.grunt;
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

    var done = context.async();
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

}
