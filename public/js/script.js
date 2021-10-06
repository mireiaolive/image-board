//console.log("script is linked");
(function () {
    Vue.component("modal-component", {
        template: "#my-component-template",
        //Props are how components talk to each other
        props: ["imageId"],
        data: function () {
            return {
                // properties we added to our data object
                url: "",
                title: "",
                description: "",
                username: "",
                created_at: "",
            };
        },

        mounted: function () {
            console.log("here first component", this);
            //console.log("prop passed:", this.passProp);
            console.log("this.imageId:", this.imageId);
            axios
                .get("/selection" + this.imageId)
                .then((results) => {
                    console.log("data response", results.data);
                    this.url = results.data.url;
                    this.title = results.data.title;
                    this.description = results.data.description;
                    this.username = results.data.username;
                    this.created_at = results.data.created_at;
                })
                .catch((err) => {
                    console.log("err", err);
                });
        },
        methods: {
            /* countUp: function () {
                this.count++;
            }, */
            sayParent: function () {
                console.log("let the main vue should do something");
                this.$emit("close");
            },
        },
    });

    Vue.component("com-component", {
        template: "#com-template",
        props: ["commId"],
        data: function () {
            return {
                comments: [],
                username: "",
                commentInput: "",
                commentRes: {},
            };
        },
        mounted: function () {
            console.log("here comments component");
            //make a get request to collect all comments
            axios
                .get("/comments" + this.commId)
                .then((results) => {
                    //console.log("request data", data);
                    console.log("results", results);
                    this.comments = results.data;
                    //console.log("request comments", this.comments);
                })
                .catch((err) => {
                    console.log("err", err);
                });
        },
        methods: {
            //object with the desired properties should be passed as the second argument to axios.post
            submitComment: function () {
                this.commentRes.image_id = this.commId;
                this.commentRes.comment_post = this.commentInput;
                this.commentRes.username = this.username;
                axios
                    .post("/comment", this.commentRes)
                    .then((results) => {
                        console.log("results in post axios", results.data);
                        this.comments.push({
                            image_id: results.data.image_id,
                            comment_post: results.data.comment_post,
                            created_at: results.data.created_at,
                            username: results.data.username,
                        });
                    })
                    .catch((err) => {
                        console.log("error in post comment", err);
                    });
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            // properties we added to our data object
            selectImage: null,
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
            uploadImage: function () {
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
            selectImageId: function (id) {
                //here we give the id to the child component
                console.log("id passed to selectImageId:", id);
                this.selectImage = id;
            },
            closeMe: function () {
                this.selectImage = null;
                console.log("we close the modal in the main vue instance!");
            },
        },
    });
})();
