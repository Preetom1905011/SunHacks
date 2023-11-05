require('dotenv').config();
const app = require('./app');

if (process.env.BACKEND_URL != 'http://localhost') {
    require("greenlock-express")
        .init({
            packageRoot: __dirname,
            configDir: "./greenlock.d",
    
            // contact for security and critical bug notices
            maintainerEmail: "rtwoo@asu.edu",
    
            // whether or not to run at cloudscale
            cluster: false
        })
        // Serves on 80 and 443
        // Get's SSL certificates magically!
        .serve(app);
} else {
    app.listen(process.env.PORT, () => {
        console.log(`App listening on ${process.env.BACKEND_URL}:${process.env.PORT}`);
    });
}
