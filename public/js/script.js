// this file will contain all of our Vue code
console.log("script is linked");
(function () {
    new Vue({
        //how we connect our vue code with our container #main in html
        // data - object that we add any info to that is dynamic / we want to render onscreen
        el: "#main",
        data: {
            images: [],
        },
        mounted: function () {
            //console.log("here vue renders on our screen");
            //console.log("outside axios: ", this);

            axios
                .get("/home")
                .then(({ data }) => {
                    //console.log("this inside axios: ", this);
                    // this line right here updates data and will cause Vue to update our UI!!!
                    this.images = data;
                    //console.log("data", data);
                    //console.log("this.images ", this.images[0].url);
                })
                .catch((err) => console.log("error in imageboard: ", err));
        },
        methods: {
            //here we store our functions
        },
    });
})();
