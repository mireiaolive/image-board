console.log("script is linked");
(function () {
    Vue.component("my-first-component", {
        template: "#my-component-template",
        props: ["passingSomeProp", "moodId"],
        data: function () {
            return {
                name: "Scallion",
                count: 1,
            };
        },
        mounted: function () {
            console.log("here first component", this);
            console.log("prop passed:", this.passProp);
            console.log("this.moodId:", this.moodId);
        },
        methods: {
            countUp: function () {
                this.count++;
            },
            sayParent: function () {
                console.log("let the main vue should do something");
                this.$emit("close");
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
            name: "Latest Images",
            moodSelected: null,
            moods: [
                { id: 1, title: "😁" },
                { id: 2, title: "🥳" },
                { id: 3, title: "😶‍🌫️" },
            ],
            moodSelected: null,
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
            selectMood: function (id) {
                console.log("id passed to selectMood:", id);
                this.moodSelected = id;
            },
            closeMe: function () {
                console.log(
                    "the component emitted close, so we should close the modal in the main vue instance!"
                );
                // remember to set the value of moodSelected back to sth falsy in
                // order to make the component disappear!
            },
        },
    });
})();
