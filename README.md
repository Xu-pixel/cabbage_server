## 后端加数据库部署

```shell
docker network create cabbage
docker run -itd --network cabbage --name mongo mongo
docker run -d --network cabbage -p 8000:8000 -e MONGO_URL=mongodb://mongo:27017 cabbage_server
```
