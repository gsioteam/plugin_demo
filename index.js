class IndexController extends Controller {
    load() {
        this.data = {
            tabs: [
                {
                    "title": "Users",
                    "id": "test",
                    "url": "https://reqres.in/api/users?page={0}"
                }, 
            ]
        };
    }
}

module.exports = IndexController;