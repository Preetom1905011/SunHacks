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
    const PORT = 8080;

    app.listen(PORT, () => {
        console.log(`App listening on http://localhost:${PORT}`);
    });
}
