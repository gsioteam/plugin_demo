
class MainController extends Controller {

    load(data) {
        this.id = data.id;
        this.url = data.url;
        this.page = 0;

        var cache = this.readCache();
        let list;
        if (cache) {
            list = cache.items;
        } else {
            list = [];
        }

        this.data = {
            list: list,
            loading: false,
            hasMore: true
        };

        if (cache) {
            let now = new Date().getTime();
            if (now - cache.time > 30 * 60 * 1000) {
                this.reload();
            }
        } else {
            this.reload();
        }
    }

    async onPressed(index) {
        var data = this.data.list[index];
        openVideo(data.link, data);
        console.log('openVideo');
    }

    onRefresh() {
        this.reload();
    }

    async onLoadMore() {
        this.setState(() => {
            this.data.loading = true;
        });
        try {

            let page = this.page + 1;
            let url = this.makeURL(page);
            let res = await fetch(url);
            let text = await res.text();
            this.page = page;
            let items = this.parseData(text, url);
    
            this.setState(()=>{
                for (let item of items) {
                    this.data.list.push(item);
                }
                this.data.loading = false;
                this.data.hasMore = items.length > 0;
            });
        } catch (e) {
            showToast(`${e}\n${e.stack}`);
            this.setState(()=>{
                this.data.loading = false;
            });
        }
        
    }

    makeURL(page) {
        return this.url.replace('{0}', page + 1);
    }

    async reload() {
        this.setState(() => {
            this.data.loading = true;
        });
        try {
            let url = this.makeURL(0);
            let res = await fetch(url);
            let text = await res.text();
            let items = this.parseData(text);
            this.page = 0;
            localStorage['cache_' + this.id] = JSON.stringify({
                time: new Date().getTime(),
                items: items,
            });
            this.setState(()=>{
                this.data.list = items;
                this.data.loading = false;
                this.data.hasMore = items.length > 0;
            });
        } catch (e) {
            showToast(`${e}\n${e.stack}`);
            this.setState(()=>{
                this.data.loading = false;
            });
        }
    }

    readCache() {
        let cache = localStorage['cache_' + this.id];
        if (cache) {
            let json = JSON.parse(cache);
            return json;
        }
    }

    parseData(text) {
        let data = JSON.parse(text);
        let list = data.data;
        
        let items = [];
        for (let item of list) {
            // Inflate the data 3x.
            items.push({
                title: `[1] ${item.first_name} ${item.last_name}` ,
                subtitle: item.email,
                picture: item.avatar,
                pictureHeaders: {
                    Referer: 'https://reqres.in/'
                },
            });

            items.push({
                title: `[2] ${item.first_name} ${item.last_name}` ,
                subtitle: item.email,
                picture: item.avatar,
                pictureHeaders: {
                    Referer: 'https://reqres.in/'
                },
            });

            items.push({
                title: `[3] ${item.first_name} ${item.last_name}` ,
                subtitle: item.email,
                picture: item.avatar,
                pictureHeaders: {
                    Referer: 'https://reqres.in/'
                },
            });
        }
        return items;
    }
}

module.exports = MainController;