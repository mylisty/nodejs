var express = require('express');
var router = express.Router();

// 增加url 依赖
// const ulla = require('url');
const db = require("./db.js");
router.get('/', function(req, res, next) {
    db.query('select * from operation_psw', function (err, rows) {
        if (err) {
            res.end('页面跳转失败：' + err);
        } else {
            res.render('users', {title: '查询成功', datas: rows});//s_pacNodeTree: pacNodeTree
        }
    })
});
// 初始数据
var data = {
    result: '00',
    msg: '操作成功',
    data: {
        psdList : []
    }
};

var serachPassword = {
    result: '00',
    msg: '操作成功',
    password:'',
    pacNodeTree:'',
};
router.get('/search', function(req, res, next) {
   let  pacNodeTree = req.spacNodeTree;

    if (isEmpty(pacNodeTree)){
        serachPassword.result = '01';
        serachPassword.msg = '查询参数有误';
        serachPassword.pacNodeTree = '';
        serachPassword.password = '';
        res.end(JSON.stringify(serachPassword));
       // res.render('users', {title: '参数不能为空', datas: []});
    }else {
        db.query('select * from operation_psw where pacNodeTree ='+pacNodeTree, function (err, rows) {
            if (err) {
                res.end(pacNodeTree+'页面跳转失败：' + err);
            } else {
                if (rows[0] !=null) {
                    serachPassword.result = '00';
                    serachPassword.msg = '操作成功';
                    serachPassword.pacNodeTree = rows[0].pacNodeTree;
                    serachPassword.password = rows[0].password;
                    res.end(JSON.stringify(serachPassword));
                }else {
                    serachPassword.result = '02';
                    serachPassword.msg = '不存在';
                    serachPassword.pacNodeTree = '';
                    serachPassword.password = '';
                    res.end(JSON.stringify(serachPassword));

                }
            }
                //res.render('users', {title: '查询成功', datas: rows});//s_pacNodeTree: pacNodeTree
        })
    }

});

 router.get('/add', function (req, res) {
  res.render('users');
});
 router.post('/add', function(req, res, next) {
   let pacNodeTree = req.body.pacNodeTree;
   let password = req.body.password;
   let description = req.body.description;
   description = 'moas';
   if (isEmpty(pacNodeTree)){
       res.render('users', {title: 'pacNodeTree不能为空', datas: []});
       return;
   }
   db.query('select * from operation_psw where pacNodeTree ='+pacNodeTree, function (err, rows) {
       if (err) {
             res.end('页面跳转失败：' + err);
       } else {
           if (rows.length) {
               res.render('users', {title: '已存在', datas: []})
           }else {
               db.query("insert into operation_psw(pacNodeTree,password,description) values(" +
                   "'" + pacNodeTree + "'," + password + ",'" + description + "')", function (err, rows) {
                   console.log("错误信息" + err );
                   if (err) {
                       res.end('页面跳转失败：' + err);
                   } else {
                       res.render('users', {title: '新增成功', datas: rows});
                   }
               });

           }
        }
   });

 });

router.post('/update', function(req, res, next) {
    let pacNodeTree = req.body.pacNodeTree;
    let password = req.body.password;
    if (isEmpty(pacNodeTree)){
        res.render('users', {title: '参数不能为空', datas: []});
    } else {
        db.query('select * from operation_psw where pacNodeTree ='+pacNodeTree, function (err, rows) {
            if (err) {
                res.end('页面跳转失败：' + err);
            } else {
                if (rows.length) {
                    db.query("update operation_psw set pacNodeTree='" + pacNodeTree + "',password='" + password  +
                        "'where pacNodeTree=" + pacNodeTree, function (err, rows) {
                        if (err) {
                            res.end('修改失败：' + err);
                        } else {
                            res.render('users', {title: '修改成功', datas: rows});
                        }
                    });
                }else {
                    res.render('users', {title: '不存在的pac', datas: []})
                }
            }
        });
    }


});

router.post('/del', function(req, res, next) {
    let pacNodeTree = req.body.pacNodeTree;
    if (isEmpty(pacNodeTree)){
        res.render('users', {title: '参数不能为空', datas: []});
    } else {
        db.query("delete from operation_psw where pacNodeTree='" + pacNodeTree+"'", function (err, rows) {
            if (err) {
                res.end('删除失败：' + err);
            } else {
                res.render('users', {title: '删除成功', datas: rows});
            }
        });f
    }

});

router.post('/searchall', function(req, res, next) {
    db.query('select * from operation_psw', function (err, rows) {
        if (err) {
            res.end('页面跳转失败：' + err);
        } else {
            data.data.psdList = rows;
            res.end(JSON.stringify(data));
        }
    })
});
function isEmpty(pacNodeTree) {
    let flag = true;
    if (pacNodeTree !== null && pacNodeTree !== '') {
        flag = false;
    }
    return flag;
}
module.exports = router;
/*
CREATE TABLE IF NOT EXISTS operation_psw (
    id INT(11) NOT NULL AUTO_INCREMENT,
    pacNodeTree VARCHAR(45) DEFAULT NULL,
        password VARCHAR(45) DEFAULT NULL,
    insert_time DATE DEFAULT NULL,
    update_time DATE DEFAULT NULL,
    description VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;*/
