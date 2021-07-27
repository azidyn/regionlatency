
module.exports = shipit => {
    
    // Load shipit-deploy tasks

    require('shipit-deploy')(shipit)

    shipit.initConfig({
        default: {
             deployTo: '/var/www/regionlatency',
             repositoryUrl: 'git@github.com:azidyn/regionlatency.git'
        },
        instestjp: { servers: 'root@instestjp' },
        instestsin: { servers: 'root@instestsin' },
        instestnl: { servers: 'root@instestnl' },
    });

    shipit.on('deployed', () => {        

        let cmd = `cd ${shipit.releasePath} && npm install`;
        shipit.remote( cmd );

    });

}
