# Docker 运行教程

## 环境变量

`.env` 里有两个变量

### NEXT_PUBLIC_PROJECT_API

后端 `API` 接口地址

```env
NEXT_PUBLIC_PROJECT_API=https://你的域名/api
```

**注意：** 注意生产环境一定要是 `https` 域名



### CACHE_CLIENT_STALE

缓存时间，以秒为单位

```env
CACHE_CLIENT_STALE=300
```

表示 `300` 秒内优先使用缓存，不会频繁请求服务端，推荐配置，可以非常有效减轻服务器压力。

如果你不想开启缓存，就把值改成 `CACHE_CLIENT_STALE=1`

**注意：** 配置缓存后，在缓存时间内修改控制端信息会导致 **无法实时生效**



## 构建镜像

在项目根目录执行：

```powershell
docker build --build-arg NEXT_PUBLIC_PROJECT_API=https://你的域名/api -t thrivex-blog .
```

如果是本地测试，可以写：

```powershell
docker build --build-arg NEXT_PUBLIC_PROJECT_API=https://localhost:9003/api -t thrivex-blog .
```

`NEXT_PUBLIC_PROJECT_API` 是构建时变量，必须在 `docker build` 时传进去



## 启动容器

```powershell
docker run -d --name thrivex-blog -p9001:9001 --env-file .env thrivex-blog
```

配置说明：

- `-d`：后台运行
- `--name thrivex-blog`：容器名称
- `-p9001:9001`：把容器9001端口映射到本机9001
- `--env-file .env`：把 `.env`里的运行时变量传给容器
- `thrivex-blog`：镜像名称



## 访问页面

**本地访问：**

```text
http://localhost:9001
```

**服务器直接访问：**

```text
http://服务器IP:9001
```

**域名访问：**

```text
https://你的域名
```



## 其他

### 查看容器

```powershell
docker ps --filter "name=thrivex-blog"
```

### 查看日志

```powershell
docker logs -f thrivex-blog
```

### 停止容器

```powershell
docker stop thrivex-blog
```

### 删除容器

```powershell
docker rm -f thrivex-blog
```

### 重新构建并启动

```powershell
docker rm -f thrivex-blog
docker build --build-arg NEXT_PUBLIC_PROJECT_API=https://你的域名/api -t thrivex-blog .
docker run -d --name thrivex-blog -p9001:9001 --env-file .env thrivex-blog
```
