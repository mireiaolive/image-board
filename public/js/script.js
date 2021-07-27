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
            name: "Latest Images",
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
                console.log("here our file", file);

                var formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("username", username);
                formData.append("file", file);
                axios
                    .post("/upload", formData)
                    .then((result) => {
                        //take images object returned, put it into the existing array
                        //add it to the images array that's in data
                        this.images.push({
                            title: result.data.title,
                            username: result.data.username,
                            description: result.data.description,
                            url: result.data.url,
                        });
                    })
                    .catch((err) => {
                        console.log("here an err", err);
                    });
            },
            fileSelection: function (e) {
                this.file = e.target.files[0];
            },
        },
    });
})();
