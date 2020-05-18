### Simple rest api features from shcemas

#### Install

```js
// OR -> npm install api-features 
yarn add api-features
```

#### How to use APIFeatures?

```js
import MyMongooseModel from './schemas....';
import ApiFeatures from 'api-features';

const getData = async => {
    const api = new ApiFeatures(MyMongooseModel.query({}), {...}, MyMongooseModel)
    api
    .limitFields()
    .sort()
    .paginator()


    const data = await api.query
    const controls = await api.getPaginatorConstrols()
}

```