// this file will contain all of our Vue code
console.log("script is linked");
(function () {
    new Vue({
        //how we connect our vue code with our container #main in html
        // data - object that we add any info to that is dynamic / we want to render onscreen
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
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
            upImage: function () {
                var title = this.title;
                var description = this.description;
                var username = this.username;
                var file = this.file;

                var formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("username", username);
                formData.append("file", file);
                axios.post("/upload", formData).then(({ data }) => {
                    //take images object returned, put it into the existing array
                });
            },
            fileSelection: function (e) {
                this.files = e.target.files[0];
            },
        },
    });
})();
