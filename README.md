## 后端加数据库部署

```shell
#生成一个网段
docker network create cabbage

#启动数据库
docker run -itd --network cabbage --name mongo mongo

#构建后端
docker build . -t cabbage_server  
#启动后端
docker run -d --network cabbage -p 8000:8000 -e MONGO_URL=mongodb://mongo:27017 cabbage_server

# 数据库 监控
docker run --net cabbage -e ME_CONFIG_MONGODB_SERVER=mongo -p 8081:8081 mongo-express
```
