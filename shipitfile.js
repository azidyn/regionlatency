
module.exports = shipit => {
    
    // Load shipit-deploy tasks

    require('shipit-deploy')(shipit)

    shipit.initConfig({
        default: {
             deployTo: '/var/www/inserver',
             repositoryUrl: 'git@github.com:azidyn/inserver.git'
        },
        insdeapp1: { servers: 'root@insdeapp1' },
        insdeapp2: { servers: 'root@insdeapp2' },
        insdeapp3: { servers: 'root@insdeapp3' }
    });

    shipit.on('deployed', () => {        

        let cmd = `cd ${shipit.releasePath} && npm install`;
        shipit.remote( cmd );

    });

}
