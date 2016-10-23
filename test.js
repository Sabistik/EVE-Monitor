var _ = require('lodash');

viewSignatureList = [];

viewSignatureList.push({
                id: 'abc',
                nature: 'xxx',
                title: 'title',
                type: 'wh',
                percent: '20',
                distance: 7,
                status: 3
            });

viewSignatureList.push({
                id: 'yyy',
                nature: 'xxx',
                title: 'title',
                type: 'wh',
                percent: '20',
                distance: 7,
                status: 3
            });


_.forEach(viewSignatureList, function(item, key) {

    //console.log(key);
    //console.log(item)
    item.status = 5;
});

console.log(viewSignatureList);