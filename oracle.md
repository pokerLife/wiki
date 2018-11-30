# Oracle数据库速查知识文档

#### 项目介绍
该项目记录了Oracle相关的速查知识汇总，主要涉及了oracle基础使用、SQL基础、oracle函数、oracle触发器、oracle高级查询、PL/SQL编程基础、PL/SQL存储过程等。若有新增，还将不断添加中。

## SQL基础部分

### 1.简介
Oracle Database，又名Oracle RDBMS，或简称Oracle，是甲骨文公司的一款关系数据库管理系统。本课程主要介绍Oracle的SQL基础，包括表空间的概念，如何登录Oracle数据库，如何管理表及表中的数据，以及约束的应用。为后续课程的学习打下一个良好的基础。

### 2.安装好之后可以登录系统账户
打开sqlplus，输入用户名system或sys（后者有最高权限）和自己设置的口令就可以登录了。

### 3.用户与表空间
系统用户有哪些？

sys,system   前者高于后者，前者必须以管理员权限登录
sysman   操作企业管理的用户，也是管理员用户

scott    普通用户

前三者用户的密码是安装时设置的，scott的默认密码是tiger

登录通用语句：
```
[username/password][@server][as sysdba|sysoper]
```
如果是远程登录，则需要输入IP地址。

也可以在前面加一个connect，比如`connect as sysdba;`

### 4.数据字典
#### （1）数据字典介绍
数据字典是Oracle存放有关数据库信息的地方，其用途是用来描述数据的。比如一个表的创建者信息，创建时间信息，所属表空间信息，用户访问权限信息等。当用户在对数据库中的数据进行操作时遇到困难就可以访问数据字典来查看详细的信息。

dba_开头的是管理员才能查看的数据字典，users_开头的是都能查看的数据字典。

数据字典或表前加上desc可以查看他们的结构。

比如desc dba_users查看数据字典的信息。
```
select username from dba_users;
```
可以从数据字典里面查看用户的名字。

#### （2）查看用户的数据字典dba_users
dba_users、user_users用来查看不同权限级别的数据字典。使用示例如：
```
select default_tablespace,temporary_tablespace from dba_users where username='SYSTEM';
```

#### （3）数据字典dba_data_files，查看数据文件的
```
select file_name from dba_data_files where tablespace_name = 'TEST1_TABLESPACE';
```
得到结果：
```
FILE_NAME
--------------------------------------------------------------------------------
D:\APP\HP\PRODUCT\11.2.0\DBHOME_1\DATABASE\TEST1FILE.DBF
```
类似的字典 dba_temp_files（查看临时表空间文件的）

### 5.如何启用scott用户
默认情况下是锁定的。
启用语句：
```
alter user username(可以替换) account unlock;
```
### 6.表空间
#### （1）表空间介绍
表空间就是在数据库中开辟的一个空间用来存储我们的数据库对象，一个数据库可以由多个表空间构成。

表空间由一个或多个数据文件构成，大小可以由用户来定义。

表空间的分类：
* 永久表空间
* 临时表空间
* UNDO表空间

永久表空间主要存储数据库中要永久存储的对象，表、视图、存储过程。临时表空间存储数据库操作当中中间执行的过程，执行结束之后自动释放掉，不进行永久性保存。UNDO表空间用于保存事务所修改数据的旧值，可以做回滚操作。

#### （2）如何查看用户的表空间？
数据字典：dba_tablespaces（针对管理员级别的用户）、user_tablespaces（针对普通用户的数据字典）

dba的表空间中，system用于管理员，也叫系统表空间，sysaux为示例的辅助表空间，undotbs1用于存储撤销信息的，temp用于存储处理的表和索引信息的临时表空间，users用于存储用户创建的数据库对象，example表空间等。

#### （3）如何设置用户的默认或者临时表空间
```
alter user username default|temporary tablespace tablespace_name;
```
```
alter user system default tablespace system;
```

#### （4）创建表空间
```
create [temporary] tabalspace tablespace_name tempfile|datafile 'xx.dbf' size xx;
```
```
create tablespace test1_tablespace datafile 'test1file.dbf' size 10M;
```
```
create temporary tablespace temptest1_tablespace tempfile 'tempfile1.dbf' size 10M;
```

#### （5）修改表空间的状态
##### 设置在线离线状态
```
alter tablespace tablespace_name online|offline;  --脱机状态不能使用它
```
dba_tablespaces字典下面的status状态可以查看状态。
```
select status from dba_tablespaces where tablespace_name = 'TEST1_TABLESPACE';
```
##### 设置只读或可读写状态，一般是read write可读写的状态
```
alter tablespace tablespace_name read only|read write;  --前提是表空间是一定是在线状态
```
#### （6）增加数据文件
```
alter tablespace tablespace_name add datafile 'xx.dbf' size xx;
```
添加后使用dba_data_files来查询。
```
select file_name from dba_data_files where tablespace_name='TEST1_TABLESPACE';
```
#### （7）删除数据文件
```
alter tablespace tablespace_name drop datafile 'xx.dbf';  --注意不能删除创建表空间时候的第一个文件，如果需要删除则必须要把表空间删掉。
```
#### （8）删除表空间
```
drop tablespace tablespace_name [including contents];  --如果需要把数据文件也删除则把后面加上。
```
### 7.数据表
#### （1）表的介绍
表是基本存储单位，要把数据都存在表中，oracle中的表都是二维结构。
一行也可以叫做记录，一列也可以叫做域或者字段。
约定：要求每一列需要有相同的数据类型。
列名要是唯一的。
每一行的数据是唯一的。

#### （2）表中的数据类型
##### 字符型

* 固定长度类型：char(n)（max2000）,nchar(n)（unicode格式，max1000，多数用来存储汉字）
* 可变长度类型：varchar2(n)（max4000）,nvarchar2(n)（unicode格式，max2000）

##### 数值型

* number(p,s) p为有效数字，s为小数点后面的位数，s可正可负
* float(n) 用来存储二进制数据，二进制数据的1-126位，一般使用number

##### 日期型

* date 范围为公元前4712年1月1日到公元9999年12月31日，可以精确到秒
* timestamp  可以精确到小数秒，一般用date类型

##### 其他类型
* blob  可存4G数据以二进制存放  
* clob  可存4G数据以字符串存放

#### （3）如何管理表
##### 创建表：  
```
create table table_name(         --在同一个用户下表明要是唯一的。
	column_name datatype,...
);
```
如
```
create table userinfo
  (id number(6,0),
  username varchar2(20),
  userpwd varchar2(20),
  email varchar2(30),
  regdate date);
```
创建完之后如果需要查看字段的信息使用desc userinfo即可查看。
#### （4）如何修改表的结构
##### 添加字段
```
alter table table_name add column_name datatype;
```
如
```
alter table userinfo add remarks varchar2(500);
```
##### 更改字段数据类型
```
alter table table_name modify column_name datatype;  --改长度或者更换数据类型
```
如
```
alter table userinfo modify remarks varchar2(400);
```
##### 删除字段
```
alter table table_name drop column column_name;
```
##### 修改字段名
```
alter table table_name rename column column_name to new_column_name;
```
##### 修改表名
```
rename table_name to new_table_name;
```
#### （5）删除表
```
truncate table table_name;  --删除表中的全部数据，没有删除表，比delete快很多。
```
```
drop table table_name;   数据和结构都删掉。
```
#### （6）操作表中的数据
##### 添加数据
```
insert into table_name (column1,column2,...) values (value1,value2,...);  --如果是所有字段都添加值，则表明后面的小括号可以省略。
```
如
```
insert into userinfo values (1,'xxx','123','xxx@126.com',sysdate);  --sysdate可以获取当前系统日期
```
查询`select * from userinfo;`
又如
```
insert into userinfo (id,username,userpwd) values (2,'yyy','123');
```
#### （7）设置某字段的默认值
##### 创建表时添加
如
```
create table userinfo1(id number(6,0),regdate date default sysdate);  --使用default关键词，虽然指定了默认值，但是在添加的时候还是要指定字段名才行
```
在创建表以后添加默认值：
```
alter table userinfo modify email default '无';  --如果在新加记录的时候不想要默认值了，则按正常的添加方式添加了就可以替换默认值了
```
#### （8）复制表数据
##### 在建表时复制
```
create table table_new as select column1,...|* from table_old;  --可以选择要复制的字段也可以复制所有
```
如：
```
create table userinfo_new as select * from userinfo;  --userinfo是被复制的表
```
##### 部分字段复制如
```
create table userinfo_new1 as select id,username from userinfo;
```
##### 在添加时复制
```
insert into table_new [(column1,...)] select column1,...|* from table_old;  --顺序和数据类型要完全一致
```
如
```
insert into userinfo_new select * from userinfo;
```
又如
```
insert into userinfo_new (id,username) select id,username from userinfo;
```
#### （9）修改表的数据
```
update tabel_name set column1=value1,...[where conditions];
```
##### 无条件更新：
```
update userinfo set userpwd = '111111';
```
##### 有条件的更新：
```
update userinfo set userpwd='123456' where username ='xxx';
```
#### （10）删除数据
##### 只能以行为单位来删除数据
```
delete from table_name;   --删除全部数据，效率慢些
delete from table_name [where conditions];
```
##### 无条件删除
```
delete from testdel;
```
##### 有条件的删除
```
delete from userinfo where username='yyy';
```
### 8.约束
#### （1）约束的介绍
约束的作用是定义规则（`最重要`），确保完整性。
#### （2）约束的种类
* 非空约束
* 主键约束
* 外键约束
* 唯一约束
* 检查约束
#### （3）非空约束
##### 在创建表时设置非空约束：
```
create table table_name(column_name datatype not null,...);
```
如：
```
create table userinfo_1 (id number(6,0),
                               username varchar2(20) not null,
                               userpwd varchar2(20) not null);
```
##### 在修改表时添加非空约束：
```
alter table tabel_name modify column_name datatype not null;
```
如
```
alter table userinfo modify username varchar2(20) not null;  --在修改之前表里面不要有任何数据
```
##### 在修改表时去除非空约束：
```
alter table tabel_name modify column_name datatype null;
```
### （4）主键约束
必不可少，确定每一行数据的唯一性。

一张表只能设计一个主键约束。

主键约束可以由多个字段构成，称为联合主键或者复合主键。

##### 在创建表时设置主键约束：
```
create table table_name(column_name datatype primary key,...);
```
如
```
create table userinfo_p(id number(6,0) primary key,
       username varchar2(20),
       userpwd varchar2(20));
```
如果用约束的话：
```
constraint constraint_name primary key (column_name1,...);  --一般用来创建联合主键
```
如
```
create table userinfo_p1(id number(6,0),
       username varchar2(20),
       userpwd varchar2(20),
       constraint pk_id_username primary key(id,username));
```
如果忘记了约束的名字，可以到`user_constraints`数据字典查询constraint_name.
如
```
select constraint_name from user_constraints where table_name='USERINFO_P1';
```
如果没有用约束来创建主键，则系统会自动命名约束的名称，可以看这个：
```
select constraint_name from user_constraints where table_name='USERINFO_P';
```
结果为：
```
CONSTRAINT_NAME
------------------------------
SYS_C0011189
```
##### 在修改表时添加主键约束：
```
add constraint constraint_name primary key(column_name1,...);   --主键名一般以pk_开头
alter table userinfo add constraint pk_id primary key(id);   --设置约束之前，如果已经有值了，必须唯一，且不能为空。
```
##### 更改约束的名称，可以修改任何约束的名字
```
alter table table_name rename constraint old_name to new_name;
```
##### 删除主键约束：
```
alter table table_name disable|enable constraint constraint_name;   --禁用|启用约束，不删除
```
查看状态：
```
select constraint_name,status from user_constraints where table_name='USERINFO';
```
##### 如果是完全删除：
```
alter table table_name drop constraint constraint_name;
```
##### 还有一种方法：
```
drop primary key[cascade];   --删除主键约束，如果存在外键约束，填写cascade，可以把其他表中引用该主键约束的一起删掉
```
#### （5）外键约束
两个表之中字段关系的约束。

##### 在创建表的时候设置外键约束：
```
--分开创建时
create table table1(column_name datatype references table2(column_name),...);
--table2为主表，table1为从表，也叫主从表。主表当中的字段必须是主表中的主键字段，主从表的字段要设置成同一个数据类型。在向设置了外键约束的表输入值的时候，从表中外键字段的值必须来自主表中的相应字段的值，或者为null值。
```
##### 如创建主表：
```
create table typeinfo(typeid varchar2(10) primary key,
       typename varchar2(20));
```
##### 创建从表：
```
create table userinfo_f(id varchar2(10) primary key,
       username varchar2(20),
       typeid_new varchar2(10) references typeinfo(typeid));
```
##### 然后给主表插入数据：
```
insert into typeinfo values(1,1);
```
##### 如果这样给从表插入数据：
```
insert into userinfo_f(id,typeid_new) values (1,2);
```
则2在主表中没有找到，会报错。需要填写
```
insert into userinfo_f(id,typeid_new) values (1,1);
```
才可以，或者那个部分留空值：
```
insert into userinfo_f(id,typeid_new) values (2,null);
```
##### 在创建表的时候设置外键约束：
```
--定义完所有的字段之后设置的约束
constraint constraint_name foreign key(column_name) references table_name(column_name) [on delete cascade];   
--后面的中括号是级联删除，表示主表当中的一条数据被删除的时候，从表当中使用了这条数据的字段所在的行也会被一起删除掉，这样确保了主从表数据的完整性。
```
如：
```
create table userinfo_f2 (id varchar2(10) primary key,
       username varchar2(20),
       typeid_new varchar2(10),
       constraint fk_typeid_new foreign key (typeid_new) references typeinfo(typeid));
```
##### 如果添加级联删除：
```
create table userinfo_f3 (id varchar2(10) primary key,
       username varchar2(20),
       typeid_new varchar2(10),
       constraint fk_typeid_new1 foreign key (typeid_new) references typeinfo(typeid) on delete cascade);
```
##### 在修改表时添加外键约束：
```
alter table tabel_name add constraint constraint_name foreign key(column_name) references table_name(column_name) [on dedelete cascade];
```
##### 删除外键约束
##### 禁用外键约束：
```
disable|enable constraint constraint_name;
```
##### 彻底删除外键约束：
```
drop constraint constraint_name;
```
#### （6）唯一约束
作用是保证字段的唯一性，和主键约束的区别是，主键约束必须是非空的，而唯一约束允许有一个空值。主键约束在一张表中只能有一个，唯一约束可以有多个。
##### 在创建表时设置唯一约束：
```
create table tabel_name(column_name datatype unique,...);
```
##### 在表级设置唯一约束：
```
constraint constraint_name unique(column_name);   --如果需要设置多个字段为唯一约束，要写多个constraint子句。
```
##### 在修改表时添加唯一约束：
```
add constraint constraint_name unique(column_name);
```
##### 删除唯一约束：
禁用：
```
disable|enable constraint constraint_name;
```
完全删除：
```
drop constraint constraint_name;
```
#### （7）检查约束
检查约束，让表当中的值更具有实际意义，能够满足一定的条件，具有实际意义。
##### 在创建表时设置检查约束：
```
create table tabel_name(column_name datatype check(expression),...);
```
如：
```
create table userinfo_c (id varchar2(10) primary key,
       username varchar2(20),
       salary number(5,0) check(salary>0));
```
比如输入`insert into userinfo_c values(1,'aaa',-50);`就会报错。
##### 在表级设置检查约束：
```
constraint constraint_name check(expression);
```
如：
```
create table userinfo_c1(id varchar2(10) primary key,
       username varchar2(20),
       salary number(5,0),
       constraint ck_salary check(salary>0));
```
##### 在修改表时添加检查约束：
```
add constraint constraint_name check(expression);
```
##### 删除检查约束：
禁用：
```
disable|enable constraint constraint_name;
```
删除：
```
drop constraint constraint_name;
```
#### （8）总结五个约束
* 非空约束
* 主键约束：每张表只能有一个，可以由多个字段构成
* 外键约束：涉及两个表之间的关系
* 唯一约束
* 检查约束

在创建表时设置约束：
只有非空约束只能在列级设置约束，不能在表级设置约束，其他的都是两者都可以的。非空约束是没有名字的。

在修改表时添加约束，也是只有非空约束不同，修改表时用的语句是
```
alter table talbe_name modify column_name datatype not null;
```
更改约束的名称：数据字典（user_constraints查看名称）
```
rename constraint old_name to new_name;
```
删除约束，非空约束较特殊
```
alter table tabel_name modify column_name datatype null;
```
其他的如果是禁用的话使用
```
disable|enable constraint constraint_name;
```
如果要永久删除可以用
```
drop constraint constraint_name;
```
删除主键约束还能用
```
drop primary key;
```
### 9.基本查询
#### （1）查询基本语句
```
select [distinct] column_name1,...|* from table_name [where conditions];  --distinct可以不显示重复的行。
```
#### （2）在SQL*PLUS中设置格式
```
column column_name heading new_name;  
```
如
```
col username heading 用户名;   --执行成功的话不会有回显
--column可以简写成col，设置新的字段名（别名），使用select语句来查询的时候就可以看到变化了，但使用desc看结构还依然不变化。
```
设置结果显示的格式：
```
column column_name format dataformat;
```
注意：字符类型只能设置它的长度。   --字符格式用a开头，后面跟它要的长度。
如
```
col username format a10;
```
如果是数值类型用，9表示一位数字，比如
```
col salary format 9999.9;
```
可以保留4位数和一位小数。
如果
```
col salary format 999.9;
```
但如果数据中有四位的数，超过这个长度的就用#####表示了，与excel一致。

如果使用col salary format $9999.9;则数字前面加了美元符号。

清除之前设置过的格式：
```
column column_name clear;
```
如
```
col salary clear;
```
#### （3）查询表中的所有字段
```
select * from table_name;
```
查询指定的字段：比如
```
select username,salary from users;
```
#### （4）给字段设置别名
不会更改字段的名字，可以为多个字段设置别名
```
select column_name as new_name,... from table_name;  --其中as可以省略，但最好加上
```
如
```
select id as 编号, username as 用户名, salary 工资 from users;
```
查看唯一值：
```
select distinct username as 用户名 from users;
```
#### （5）运算符和表达式
运算符大家都比较熟悉了，而表达式=操作数+运算符组成。

oracle中的操作数可以有变量、常量、字段。

运算符有算术运算符（+、-、*、/），比较运算符（>,>=,<,<=,=,<>都是用在where条件里面的，两个数进行比较得到的结果是布尔类型的，真或者假），逻辑运算符（and,or,not）

##### 在select语句中使用运算符
在查询结果中，给每个员工的工资加上200元，但数据本身没变。
如
```
select id,username,salary+200 from users;
```
使用比较运算符：

查询工资高于800元的员工的姓名；
如
```
select username from users where salary > 800;
```
使用逻辑运算符：
如
```
select username from users where salary > 800 and salary <>1800.5;
select username from users where salary > 800 or salary <>1800.5;
```
#### （6）带条件的查询
如
```
select salary from users where username='aaa';
select username,salary from users where id=3;
```
多条件如
```
select * from users where username='aaa' or salary<=2000 and salary>800;
```
逻辑运算符的优先级顺序：not,and,or

比较运算符优先级高于逻辑运算符

not的例子：
```
select * from users where not(username='aaa');
```
#### （7）模糊查询
like关键字，也可以归入比较运算符当中。

通配符的使用（_表示一个字符，%表示0到多个任意字符）
如
```
select * from users where username like 'a%';  --以a开头的行
select username from users where username like '%a%';   --含有a的
```
#### （8）范围查询
between...and   --表示从什么到什么之间。查询结果是含头又含尾的区间。

如果不在这个之间的，在它们前面加上not
如
```
select * from users where salary not between 800 and 2000;
```
in/not in   后面跟着小括号，里面是一个列表的值，一个具体的值。
如
```
select * from users where username in ('aaa','bbb');
select * from users where username not in ('aaa','bbb');
```
#### （9）对查询结果排序
```
select...from...[where...] order by column1 desc/asc,...  --desc为降序排列，asc升序
```
#### （10）case...when语句
```
case column_name when value1 then result1,...[else result] end;
```
如
```
select username,case username when 'aaa' then '计算机部门'
    when 'bbb' then '市场部门' else '其他部门' end as 部门
    from users;
```
另一种形式：
```
case when column_name=value1 then result1,...[else result] end;
```
如
```
select username,case when username='aaa' then '计算机部门'
    when username='bbb' then '市场部门' else '其他部门' end as 部门
    from users;
```
如
```
select username,case when salary<800 then '工资低' when salary>5000 then '工资高' end as 工资水平 from users;
```
#### （11）decode函数的使用
```
decode(column_name,value1,result1,...,defaultvalue)
```
如
```
select username,decode(username,'aaa','计算机部门','bbb','市场部门','其他') as 部门 from users;
```


### 10.其他一些实用命令
* 可以使用host cls来清屏。
* 查看用户show user。
* 使用上下箭头可以选择历史输入记录来使用。


=====================================================================================
## Oracle函数部分

### 1.函数的作用
* 方便数据的统计
* 处理查询结果
### 2.函数的分类
* 数值函数
* 字符函数
* 日期函数
* 转换函数
### 3.数值函数
#### 四舍五入
```
round(n[,m])
```
* 省略m：0
* m>0:小数点后m位
* m<0:小数点前m位

如
```
select round(23.4),round(23.45,1),round(23.45,-1)from dual;
```
#### 取整函数
```
ceil(n)  --取最大值
floor(n) --取最小值
select ceil(23.45),floor(23.45) from dual;
```
结果：
```
CEIL(23.45) FLOOR(23.45)
----------- ------------
         24           23
```
#### 常用计算
```
abs(n)   --取绝对值
```
如
```
select abs(23.45),abs(-23),abs(0) from dual;
```
=====
```
mod(m,n)  --取余数
```
如
```
select mod(5,2) from dual;
```
=====
```
power(m,n)  --取m的n次幂
```
如
```
select power(2,3),power(null,2) from dual;
```
=====
```
sqrt(n)   --求平方根
```
如
```
select sqrt(16) from dual;
```
=====
#### 三角函数
```
sin(n),asin(n)
cos(n),acos(n)
tan(n),atan(n)   --提供弧度参数
```
如
```
select sin(3.124) from dual;
```
### 4.字符函数
#### 大小写转换函数
```
upper(char)   --转换为大写
lower(char)   --转换为小写
initcap(char)  --首字母大写
```
如
```
select upper('abde'),lower('ADe'),initcap('asd') from dual;
```
#### 获取子字符
```
substr(char,[m[,n]])   --获取子字符，分别是从哪取，从哪个位置开始取以及取出多少位，n省略时，从m的位置截取到结束，m从1开始如果m写0也是从第一个字符开始。如果m为负数时，从字符串的尾部开始截取
```
如
```
select substr('abcde',2,3),substr('abcde',2),substr('abcde',-2,1) from dual;
```
#### 获取字符串长度函数
```
length(char) --会包含空格的长度
```
如
```
select length('acd ') from dual;
```
#### 字符串连接函数
```
concat(char1,char2)   --与||作用一样
```
如
```
select concat('ab','cd') from dual;
```
#### 去除子串函数
```
trim(c2 from c1)   --代表从c1中去除c2字符串，就是子文本替换，要求c2中只能是一个字符
```
如
```
select trim ('a' from 'abcde') from dual;
```
=====
```
ltrim(c1[,c2])    --从c1中去除c2，从左边开始去除，要求第一个就是要去除的字符，有多少个重复的该字符就会去除多少次
```
如
```
select ltrim('ababaa','a') from dual;
```
=====
```
rtrim(c1[,c2])    --从c1中去除c2，要求右侧第一个就是要去除的字符，有多少个重复的该字符就会去除多少次
```
=====
```
trim(c1)   --代表去除首尾的空格，删首尾空，同理ltrim和rtrim只有一个参数时。
```
=====
```
replace(char,s_string[,r_string])  --替换函数，省略第三个参数则用空白替换
```
如
```
select replace('abcde','a','A') from dual;
select replace('abcde','c') from dual;
select replace('abced','ab','A') from dual;
```
### 5.日期函数
#### 系统时间
sysdate   默认格式：DD-MON-RR 天-月-年

#### 日期操作
```
add_months(date,i)  --用于添加指定的月份，返回在指定的日期上添加的月份，i可以是任意整数，如果i是负数，则是在原有的值上减去该月份了
```
如
```
select add_months(sysdate,3),add_months(sysdate,-3) from dual;
```
=====
```
next_day(date,char)  --第二个参数指定星期几，在中文环境下输入星期X即可，返回下一个周几是哪一天。
```
如
```
select next_day(sysdate,'星期一') from dual;
```
=====
```
last_day(date)   --用于返回日期所在月的最后一天
```
如
```
select last_day(sysdate) from dual;
```
=====
```
month_between(date1,date2)  --计算两个日期之间间隔的月份，前者减后者
```
如
```
select months_between('20-5月-15','10-1月-15') from dual;
```
=====
```
extract(date from datetime)   --返回相应的日期部分
```
如
```
select extract(year from sysdate) from dual;   --可以改month或者day
select extract(hour from timestamp '2015-10-1 17:25:13') from dual;
```
=====

用于截取日期时间的trunc函数

用法：trunc（字段名，精度）

具体实例：

在表table1中，有一个字段名为sysdate，该行id=123，日期显示：2016/10/28 15:11:58

1、截取时间到年时，sql语句如下：
```
select trunc(sysdate,'yyyy') from table1 where id=123;  --yyyy也可用year替换
```
显示：2016/1/1

2、截取时间到月时，sql语句：
```
select trunc(sysdate,'mm') from table1 where id=123;
```
显示：2016/10/1

3、截取时间到日时，sql语句：
```
select trunc(sysdate,'dd') from table1 where id=123;
```
显示：2016/10/28

4、截取时间到小时时，sql语句：
```
select trunc(sysdate,'hh') from table1 where id=123;
```
显示：2016/10/28 15:00:00

5、截取时间到分钟时，sql语句：
```
select trunc(sysdate,'mi') from table1 where id=123;
```
显示：2016/10/28 15:11:00

6、截取时间到秒暂时不知道怎么操作

7、不可直接用trunc(sysdate,'yyyy-mm-dd')，会提示“精度说明符过多”

8.如果不填写第二个参数，则默认到DD，包含年月日，不包含时分秒。

### 6.转换函数
```
to_char(date[,fmt[,params]])  --date为需要转换的日期，fmt为转换的格式，params为转换的语言（通常默认会自动选择，可以省略，与安装语言一致）
```
默认格式：DD-MON-RR

可以定义的格式：
* YY YYYY YEAR
* MM MONTH
* DD DAY
* HH24 HH12
* MI SS
如
```
select to_char(sysdate,'yyyy-mm-dd hh24:mi:ss') from dual;
```
=====
```
to_date(char[,fmt[,params]])
```
如
```
select to_date('2015-05-22','yyyy-mm-dd') from dual;   --注意显示的时候仍然按照时间的默认格式来显示
```
=====
```
to_char(number[,fmt])
```
fmt列表：
* 9:显示数字并忽略前面的0
* 0：显示数字，位数不足，用0补齐
* .或D：显示小数点
* ,或G：显示千分位
* $：美元符号
* S：加正负号（前后都可以）
如
```
select to_char(12345.678,'$99,999.999') from dual;
select to_char(12345.678,'s99,999.999') from dual;
```
=====
```
to_number(char[,fmt])
```
fmt是转换的格式，可以省略
如
```
select to_number('$1,000','$9999') from dual;
```
### 7.一些课堂案例
#### 在查询中使用函数
如
* 在员工信息表中查询员工的生日
```
substr(char[,m[,n]])
```
* 将员工信息表中的年龄字段与10取余数
* 取员工入职的年份
* 查询出5月份入职的员工信息

=====================================================================================
## Oracle高级查询部分
### 1.简介
本部分需要有如下两个部分的基础
* 《oracle数据库开发必备利器之SQL基础》
* 《oracle数据库开发利器之函数》
### 2.分组查询
#### （1）什么是分组函数
分组函数作用于一组数据，并对一组数据返回一个值。
结构：
```
select [column,] group function(column),...
from table
[where condition]
[group by column]
[order by column];
```
#### （2）常见的分组函数
##### avg 求平均值  和  sum 求和
* 求出员工的平均工资和工资的总和
* 求出员工工资的最大值和最小值
* 求出员工的总人数
* distinct关键字求出部门数
如
```
select count(distinct deptno) from emp;
```
##### min 最小值
##### max 最大值
##### count 求个数
##### wm_concat 行转列
如
```
select deptno 部门号,wm_concat(ename) 部门中员工的姓名 from emp group by deptno;
```
#### （3）分组函数与空值
* 举例1：统计员工的平均工资
如
```
select sum(sal)/count(*) 一,sum(sal)/count(sal) 二,avg(sal) 三 from emp;
```
结果一样

* 举例二：统计员工的平均奖金
如
```
select sum(comm)/count(*) 一,sum(comm)/count(comm) 二,avg(comm) 三 from emp;
```
二和三结果一样，一不一样，因为在奖金列里面含有空值，count的时候数数不一样

所以分组函数会自动忽略空值，可以在分组函数中使用nvl函数来使分组函数无法忽略空值
如
```
select count(*),count(nvl(comm,0)) from emp;
```
#### （4）分组数据
group by 子句
* 求出员工表中各个部门的平均工资
注意：在select列表中所有未包含在组函数（就是汇总计算xxx的列）中的列都应该包含在group by子句中，但包含在group by子句中的列不必包含在select列表中
如
```
select avg(sal) from emp group by deptno;
```
使用多个列分组
如
```
select deptno,job,sum(sal) from emp group by deptno,job order by deptno;
```
#### （5）非法使用组函数
要求所用包含于select列表中，而未包含于组函数中的列都必须包含于group by子句中。
```
select deptno,count(ename)
from emp;
```
这里的deptno没有包含在group by子句中，所以会报错。
#### （6）过滤分组
* 求平均工资大于2000的部门，having子句的使用
在group by后加`[having group_condition]`
如
```
select deptno,avg(sal) from emp group by deptno having avg(sal) > 2000;
```
注意不能在where子句中使用组函数（注意）。

可以在having子句中使用组函数。

如果在能使用where的场景下，从SQL优化的角度来看，尽量使用where效率更高，因为having是在分组的基础上过滤分组的结果，而where是先过滤，再分组。要处理的记录数不同。所以where能使分组记录数大大降低，从而提高效率。
#### （7）在分组查询中使用order by子句
* 示例：求每个部门的平均工资，要求显示：部门号，部门的平均工资，并且按照工资升序排列
可以按照：列、别名、表达式、序号进行排序
```
select deptno,avg(sal) from emp group by deptno order by avg(sal);
select deptno,avg(sal) 平均工资 from emp group by deptno order by 2;  --也可以填写序号
```
#### （8）分组函数的嵌套
* 示例：求部门平均工资的最大值
如
```
select max(avg(sal)) from emp group by deptno;
```
#### （9）group by语句的增强
* 按部门、不同的职位显示工资的总额；同时按部门，统计工资总额；统计所有员工的工资总额。
如
```
select deptno,job,sum(sal) from emp group by rollup(deptno,job);
```
结果：
```
DEPTNO JOB         SUM(SAL)
------ --------- ----------
    10 CLERK           4541
    10 MANAGER         6455
    10 PRESIDENT       9711
    10                20707
    20 CLERK           8235
    20 ANALYST        12360
    20 MANAGER       7032.5
    20              27627.5
    30 CLERK         4117.5
    30 MANAGER         6895
    30 SALESMAN       18648
    30              29660.5
                      77995
```
rollup就可以实现上述的效果。小计、总计的效果，可以用在报表里面。

再次优化，先运行：
```
break on deptno skip 2
```
再运行上面的代码即可。
#### （10）sqlplus的报表功能
如
```
ttitle col 15 '我的报表' col 35 sql.pno    --15表示空15列，sql.pno表示报表页码
col deptno heading 部门号   --设置别名
col job heading 职位
col sum(sal) heading 工资总额
break on deptno skip 1		--deptno只显示一次，部门间间隔一行
```  
结果：
```
              我的报表                     1
    部门号 职位        工资总额
---------- --------- ----------
        10 CLERK           4541
           MANAGER         6455
           PRESIDENT       9711
                          20707

        20 CLERK           8235
           ANALYST        12360
           MANAGER       7032.5
                        27627.5


              我的报表                     2
    部门号 职位        工资总额
---------- --------- ----------
        30 CLERK         4117.5
           MANAGER         6895
           SALESMAN       18648
                        29660.5

                          77995
```

### 3.多表查询
#### （1）简介
按数据库设计原则，员工表中只有部门的编号信息，部门的详细信息会存放在部门表中。

什么是多表查询：就是从多个表中获取数据。

前提是有一个外键约束来表示员工是哪个部门的，有个一个部门号来联结。
#### （2）笛卡尔集
有了它才有多表查询的存在。笛卡尔集的列数等于每张表列数的相加，行数等于每张表的行数相乘。比如`emp*dept`有六列六行。里面的每一条记录不一定都是对的。多表查询就是要从笛卡尔集中选择出正确的记录。需要一个连接条件，比如部门号相等。有了连接条件，就能避免使用笛卡尔全集。在实际运行环境下，应提供where连接条件，避免使用笛卡尔全集。连接条件至少有要连接表数-1个。

创建笛卡尔集可以使用全连接：
`FULL JOIN`
#### （3）连接的类型
* 等值连接
* 不等值连接
* 外连接
* 自连接
#### （4）等值连接
如
```
select e.empno,e.ename,e.sal,d.dname from emp e,dept d where e.deptno=d.deptno;
```
#### （5）不等值连接
如
```
SELECT e.empno,e.ename,e.sal,s.grade FROM emp e,salgrade s WHERE e.sal BETWEEN s.losal AND s.hisal;
```
#### （6）外连接
如
```
SELECT d.deptno 部门号,d.dname 部门名称,COUNT(e.empno) 人数 FROM emp e,dept d WHERE e.deptno=d.deptno GROUP BY d.deptno,d.dname;   --漏了一个部门
```
核心：通过外连接，把对于连接条件不成立的记录，仍然包含在最后的结果中。

左外连接（`LEFT [OUTER] JOIN`）：当连接条件不成立的时候，等号左边的表仍然被包含

右外连接（`RIGHT [OUTER] JOIN`）：当连接条件不成立的时候，等号右边的表仍然被包含

因此上述表达式改为：

改为右外连接  方法是在相反的方向的等值连接结尾加上(+),比如右外连接就是加在左边的最后。
```
SELECT d.deptno 部门号,d.dname 部门名称,COUNT(e.empno) 人数 FROM emp e,dept d WHERE e.deptno(+)=d.deptno GROUP BY d.deptno,d.dname;
```
或者写成：
```
SELECT d.deptno 部门号,d.dname 部门名称,COUNT(e.empno) 人数 FROM emp e,dept d WHERE e.deptno right join d.deptno GROUP BY d.deptno,d.dname;
```
得到结果：
```
部门号 部门名称               人数
------ -------------- ----------
    10 ACCOUNTING              3
    40 OPERATIONS              0
    20 RESEARCH                5
    30 SALES                   6
```
#### （7）自连接
* 作用：通过别名，将同一张表视为多张表（核心）    `INNER JOIN`

如
```
SELECT e.ename 员工姓名,b.ename 老板姓名 FROM emp e,emp b WHERE e.mgr=b.empno;
```
##### 自连接存在的问题
尽管是查询一张表，但本质上仍然是多表查询，会产生笛卡尔集。

可以通过这个看笛卡尔集有多少条记录`select count(*) from emp e,emp b;`表越多，次方越多。比如员工表中有一亿条记录，如果看成三张表，就有一亿的立方的笛卡尔集，所以自连接不适合查询大表。

* 所以要使用解决方法： **层次查询** （单表查询，只有在一张表时才不会查询笛卡尔集，在某些情况下可以取代自连接）。

* 层次查询的原理：可以把前面的结果变成分level的一棵树。这棵树的根是没有上司的king，也就是mgr就是NULL。
如：
```
SELECT level,empno,ename,sal,mgr FROM emp CONNECT BY PRIOR empno=mgr START WITH mgr IS NULL ORDER BY 1;
```
* 自连接的优点：结果直观。缺点：不适合操作大表。

* 层次查询的优点：适合单表查询，不会产生笛卡尔集。缺点：并没有自连接那么直观。

### 4.子查询
#### （1）子查询介绍
为什么要学习子查询：子查询可以解决不能一步求解的问题
* 示例：查询工资比scott高的员工信息

子查询的语法：其实也就是select语句的嵌套
```
select select_list
from table
where expr operator
	(select select_list
	from table);
```
如
```
select * from emp where sal > (select sal from emp where ename='SCOTT');
```
#### （2）子查询注意的十个问题
* 子查询语法中的小括号

语法中一定要有小括号，不然是错的。
* 子查询的书写风格

该换行的换行，该缩进的索引，可以便于阅读。

* 可以使用子查询的位置：where,select,having,from

select后面使用，要求一定要只返回一条记录，要是单行子查询才行，多行子查询不行。
如
```
SELECT empno,ename,sal,(SELECT job FROM emp WHERE empno=7839) 第四列
FROM emp;
```
在having后面使用：
如
```
SELECT deptno,AVG(sal)
FROM emp
GROUP BY deptno
HAVING AVG(sal) > (SELECT MAX(sal)
                  FROM emp
		WHERE deptno=30);
```
在from后面放置：

非常的重要，很多问题都是在from后面方式子查询来解决的
如
```
SELECT * from(SELECT empno,ename,sal FROM emp);
```
* 不可以使用子查询的位置：group by

如
```
SELECT AVG(sal)
FROM emp
GROUP BY (SELECT deptno FROM emp);   --会报错，这里不允许出现子查询表达式
```
* 强调：from后面的子查询，比较特殊，比较重要

如
```
SELECT *
FROM (SELECT empno,ename,sal,sal*12 annsal FROM emp);
```
* 主查询和子查询可以不是同一张表

如
```
SELECT * FROM emp WHERE deptno=
                  (SELECT deptno
		FROM dept
		WHERE dname='SALES');
```
多表查询代码：
```
SELECT e.*							
FROM emp e,dept d
WHERE e.deptno=d.deptno AND d.dname='SALES';
```
哪种查询方式好呢？从理论上来讲，尽量使用多表查询比较好，因为子查询需要对数据库访问两次，而多表查询只需要对数据库访问一次。但实际情况下有可能不一样，因为多表查询的笛卡尔集可能很大所以慢了。

* 一般不在子查询中，使用排序；但在Top-N分析问题中，必须对子查询排序

比如找到员工表中工资最高的前三名。

`rownum`行号，是一个伪列，表上没有这一列，当做一些特殊操作的时候，oracle自动加上。行号需要注意的问题：行号永远按照默认的顺序生成；行号只能使用<，<=，不能使用>或者>=这样的符号。
如
```
SELECT ROWNUM,empno,ename,sal
FROM (SELECT * FROM emp ORDER BY sal DESC)
WHERE ROWNUM<=3;
```
* 一般先执行子查询，再执行主查询；但相关子查询例外

相关子查询的表必须设定一个别名，然后把主查询的内容传入到子查询中进行查询。
如
```
SELECT empno,ename,sal,(SELECT AVG(sal) FROM emp WHERE deptno=e.deptno) avgsal
FROM emp e
WHERE sal > (SELECT AVG(sal) FROM emp WHERE deptno=e.deptno);
```
这里就把主查询e表中的部门号传入子查询中进行查询了。
* 单行子查询只能使用单行操作符；多行子查询只能使用多行操作符

##### 单行操作符：=、>、>=、<、<=、<>
如
```
SELECT * FROM emp
WHERE job = (SELECT job FROM emp WHERE empno=7566)
AND sal > (SELECT sal FROM emp WHERE empno=7782);
```
又如
```
SELECT * FROM emp
WHERE sal = (SELECT MIN(sal) FROM emp);
```
如
```
SELECT deptno,MIN(sal)
FROM emp
GROUP BY deptno
HAVING MIN(sal) > (SELECT MIN(sal)
                  FROM emp
		WHERE deptno=20);
```
非法使用单行子查询：
如
```
select empno,ename from emp where sal=(select min(sal)
		from emp
		group by deptno);    --因为子查询返回了不止一行，所以是非法使用单行子查询。
```
##### 多行操作符：in（等于列表中的任意一个）、any（和子查询返回的任意一个值比较）、all（和子查询返回的所有值比较）
in：
如
```
SELECT * FROM emp 
WHERE deptno IN (SELECT deptno FROM dept WHERE dname='SALES' OR dname='ACCOUNTING');
```
又如
```
SELECT e.* FROM emp e,dept d
WHERE e.deptno=d.deptno AND (d.dname='SALES' OR d.dname='ACCOUNTING');
```
any：
如
```
SELECT * FROM emp
WHERE sal > ANY(SELECT sal FROM emp WHERE deptno=30);
```
等价于
```
SELECT * FROM emp
WHERE sal > (SELECT min(sal) FROM emp WHERE deptno=30);
```
all：
如
```
SELECT * FROM emp
WHERE sal > ALL(SELECT sal FROM emp WHERE deptno=30);
```
等价于：
```
SELECT * FROM emp
WHERE sal > (SELECT MAX(sal) FROM emp WHERE deptno=30);
```
* 注意：子查询中是null值的问题

单行子查询中返回空值，要使用in之类的关键字，等于号的话永远为空。

多行子查询中，如查询不是老板的员工
如：
```
SELECT * FROM emp
WHERE empno NOT IN (SELECT mgr FROM emp);   --会不返回结果，因为当子查询中包含空值的时候，不能使用not in，因为not in等同于不等于所有（永远为假）。
```
所以修改为：
```
SELECT * FROM emp
WHERE empno NOT IN (SELECT mgr FROM emp
               WHERE mgr IS NOT NULL);
```
### 5.综合示例
#### （1）案例一
* 分页查询显示员工信息：显示员工号，姓名，月薪
* 每页显示四条记录
* 显示第二页的员工
* 按照月薪降序排列
* 注意：rownum只能使用<,<=不能使用>,>=，因为oracle数据库是一个行式数据库，取了第一行才能取第二行，所以行号永远从1开始，所以比如rownum>=5这样的条件永远为假。

所以分页查询：
```
SELECT r,empno,ename,sal
FROM(SELECT ROWNUM r,empno,ename,sal
from(SELECT ROWNUM,empno,ename,sal FROM emp ORDER BY sal DESC) e1
WHERE ROWNUM<=8) e2
WHERE r>=5;
```
#### （2）案例二
* 找到员工表中薪水大于本部门平均薪水的员工

如
```
SELECT e.empno,e.ename,e.sal,d.avgsal
FROM emp e,(SELECT deptno,AVG(sal) avgsal FROM emp GROUP BY deptno) d
WHERE e.deptno=d.deptno AND e.sal>d.avgsal;   --多表查询
```
如果需要查询执行计划看性能的话，则在语句前面加上`EXPLAIN PLAN FOR`

执行一遍之后，运行`select * from table(dbms_xplan.display);`即可查看性能分析，看消耗的CPU的多少来判定性能的优劣。
#### （3）案例三
* 按部门统计员工人数，按照规定格式输入，已知员工的入职年份在80,81,82,87年之中。
如
```
SELECT COUNT(*) Total,
       SUM(DECODE(to_char(hiredate,'yyyy'),'1980',1,0)) "1980",
       SUM(DECODE(to_char(hiredate,'yyyy'),'1981',1,0)) "1981",
	SUM(DECODE(to_char(hiredate,'yyyy'),'1982',1,0)) "1982",
	SUM(DECODE(to_char(hiredate,'yyyy'),'1987',1,0)) "1987"
FROM emp;
```
使用子查询方法：
```
SELECT
(SELECT COUNT(*) FROM emp) Total,
(SELECT COUNT(*) FROM emp WHERE to_char(hiredate,'yyyy')='1980') "1980",
(SELECT COUNT(*) FROM emp WHERE to_char(hiredate,'yyyy')='1981') "1981",
(SELECT COUNT(*) FROM emp WHERE to_char(hiredate,'yyyy')='1982') "1982",
(SELECT COUNT(*) FROM emp WHERE to_char(hiredate,'yyyy')='1987') "1987"
FROM dual;
```
#### （4）练习
新建两个表，然后按要求查到相关的内容

第一个表：
```
CI_ID                STU_IDS
-------------------- --------------------------------------------------------------------------------
1                    1,2,3,4
2                    1,4
```
表结构：
```
Name    Type          Nullable Default Comments 
------- ------------- -------- ------- -------- 
CI_ID   VARCHAR2(20)                            
STU_IDS VARCHAR2(100) Y  
```                       
第二个表：
```
STU_ID               STU_NAME
-------------------- --------------------
1                    张三
2                    李四
3                    王五
4                    赵六
```
表结构：
```
Name     Type         Nullable Default Comments 
-------- ------------ -------- ------- -------- 
STU_ID   VARCHAR2(20)                           
STU_NAME VARCHAR2(20) Y  
```                       
 **提示：**
 
1.需要进行两个表的连接查询，为两个表都取别名

2.使用instr(a,b)函数，该函数的含义为：如果字符串b在字符串a的里面，则返回的是b在a中的位置，及返回值大于0

3.需要用到分组查询

4.使用wm_concat(cols)函数对学生姓名用逗号进行拼接
```
--结果查询语句
SELECT ci_id,wm_concat(stu_name) stu_name 
FROM pm_stu,pm_ci 
WHERE INSTR(stu_ids,stu_id)>0 
GROUP BY ci_id;
```
得到正确结果：
```
CI_ID                STU_NAME
-------------------- --------------------------------------------------------------------------------
1                    张三,赵六,王五,李四
2                    张三,赵六
```
同时学会了一个，如果在oracle中，需要实现如果表已经存在则先删除表的操作，写法为：
```
--如果已经存在表则先删除表
DECLARE
  k NUMBER;
BEGIN
	select count(*) INTO k from all_tables where table_name='PM_CI';
	IF k=1 THEN
		execute IMMEDIATE 'DROP TABLE pm_ci';
	END IF;
END;
/
```
其中查询的表名和drop的表名变成你要检测的表名即可。

=====================================================================================

## PL/SQL编程基础部分
### 1.为什么要学PL/SQL编程
使用PLSQL语言操作Oracle数据库的效率最高。

之前用sql语句是命令式的语言，但如果案例是复杂的，比如需要分条件来做不同的事情的，就需要PL/SQL效率会更高，不需要用其他的编程语言。

* PL/SQL介绍

全称是Procedure Language/SQL，是oracle对sql语言的过程化扩展

指在SQL命令语言中增加了过程处理语句（如分支、循环等），使SQL语言具有过程处理能力。

（1）是sql的扩展，支持sql语句。

（2）是面向过程的语言。
### 2.语句块通用格式
```
declare
    --说明部分（变量说明、光标申明、例外说明）
begin
    --程序体（DML语句）
    dbms_output.put_line('Hello World');
exception
    --例外处理语句
end;
/
```
```
/    --这个正斜杠用来退出前面的代码编写并且执行语句
```
```
--查看程序包的结构
desc 程序包名字
```
### 3.打开输出开关
```
set serveroutput on
```
### 4.不同数据库中SQL扩展
* Oracle：PL/SQL
* DB2：SQL/PL
* SQL Server：Transac-SQL(T-SQL)
### 5. PL/SQL的说明部分
* 定义基本变量
类型：char，varchar2，date，number，boolean，long

举例：名字在片面，变量是在后面，:=为赋值符号不是单=号
```
var1      char(15);
married   bollean := true;
psal      number(7,2);  --说明有两位小数
```
* 定义引用型变量
```
my_name emp.ename%type;  --引用ename的类型，ename是啥类型变量就是啥类型
```
第二种赋值方式：
```
select ename,sal into pename,psal from emp where empno=7839;
```
这里的into就可以赋值，是一一对应的。
* 定义记录型变量
```
emp_rec emp%rowtype;   
--取表中一行的类型，作为变量的类型，可以理解为数组，如果需要取用到列里面的某一行，就像如下写法：
emp_rec.ename := 'ADAMS';   --ename是列的名字。
```
### 6. PL/SQL的流程控制语句
#### （1）if语句：
情况一
```
if 条件 then 语句1;
语句2;
end if;
```
情况二
```
if 条件 then 语句序列1;
else 语句序列2;
end if;
```
情况三
```
if 条件 then 语句;
elsif 语句 then 语句;    --特别注意下elsif
else 语句;
end if;
```
#### （2）while循环：
```
while total <= 25000 loop
...
total := total + salary;
end loop;
```
#### （3）loop循环：
```
--在控制光标的时候比较简单
loop
exit[when 条件];
......
end loop;
```
#### （4）for循环：
```
for i in 1..3 loop   --表示连续区间用这种写法
语句序列;
end loop;
```
### 7.光标
#### （1）光标的引入背景
select如果返回的结果有多行的话就会出错，所以需要引入光标，光标cursor就是一个结果集。也叫游标。
#### （2）光标的语法
```
cursor 光标名 [(参数名 数据类型[,参数名 数据类型]...)] is select 语句;
```
如 
```
cursor c1 is select ename from emp;
```
此外，光标是可以带参数的。
#### （3）光标的一些操作
* 打开光标：
```
open c1;(打开光标执行查询)
```
* 关闭光标：
```
close c1;(关闭游标释放资源)
```
* 取一行光标的值：
```
fetch c1 into pename; (取一行到变量中)
```
* fetch的作用：

（1）把当前指针指向的记录返回；

（2）将指针指向下一条记录。
#### （4）光标的属性
* %found(光标能取到内容返回true，否则false)    
* %notfound（与前者相反）
* %isopen：判断光标是否打开
* %rowcount：影响的行数，不是总行数，比如光标取走了10行的数据，那么这个值就是10
#### （5）光标的限制
默认情况下，oracle数据库只允许在同一个会话中打开300个光标

* 修改光标数的限制：
```
alter system set open_cursors=400 scope=both; 
``` 
scope是范围，取值有三个：both, memory（只更改当前实例）, spfile（只更改参数文件，数据库需要重启）
### 8.例外
#### （1）例外的概念
例外是程序设计语言提供的一种功能，用来增强程序的健壮性和容错性。
#### （2）例外的分类
* 系统例外
* 自定义例外
#### （3）系统例外
* no_data_found   没有找到数据，select语句没有找到结果的时候
* too_many_rows   select...into语句匹配多个行
* zero_divide     被零除
* value_error     算术或转换错误
* timeout_on_resource   在等待资源时发生超时（分布式数据库的访问会用到）
#### （4）自定义例外
定义变量，类型是exception

使用raise关键字抛出自定义例外
### 9.程序设计方法
瀑布模型：
```
需求分析
	设计1.概要设计2.详细设计
		编码Coding
			测试Testing
				上线
```
以上步骤就像水流一下，最忌讳一上来就编码。

想明白SQL语句、变量。

变量：1.初始值是多少2.最终值如何得到


### 10.其他小技巧：
* 使用||符号来连接文本字符串。
* --表示单行注释，/*   */表示多行输入
* 单个等于号表示判断。
* plsql中大小写不敏感。
* then语句相当于一个大括号，后面的语句可以一起被处理，比如如下写法：
```
when zero_divide then dbms_output.put_line('1:0不能做被除数');
                          dbms_output.put_line('2:0不能做被除数');
```
这里两句话都会被打印出来。
* 把握一个原则：能不操作数据库就不操作数据库，比单单加减乘除的计算慢。

=====================================================================================
## Oracle触发器部分
### 1.触发器的概念
触发器是一个特殊的存储过程。是一个与表相关联的、存储的PL/SQL程序。

作用：每当一个特定的数据操作语句（insert、update、delete，注意没有select）在指定的表上发出时，oracle自动地执行触发器中定义的语句序列。
### 2.触发器的类型
* 语句级的触发器

在指定的操作语句操作之前或之后执行一次，不管这条语句影响了多少行。

语句级触发器针对表，只会触发一次
* 行级的触发器

触发语句作用的每一条记录都被触发。在行级触发器中使用:old和:new伪记录变量，识别值的状态。如果有for each row就表示行级触发器。
如
```
insert into emp10 select * from emp where deptno=10;
```
会查出3条记录。

行级触发器针对行，有多少条记录就触发多少次。
### 3.第一个触发器
每当成功插入新员工后，自动打印一句话，"成功插入新员工"。单词trigger

例如：
```
create trigger saynewemp
after insert
on emp
declare
begin
	dbms_output.put_line('成功插入新员工');
end;
/
```
### 4.触发器的具体应用场景
（1）复杂的安全性检查   --比如周末不允许操作数据库

（2）数据的确认   --涨后的工资大于涨前的工资

（3）数据库审计   --跟踪表上所做的数据操作，什么时间什么人操作了什么数据，操作的人是什么。基于值的审计

（4）数据的备份和同步   --异地备份，把主数据的数据自动同步到备数据库中
### 5.创建触发器的语法
```
create [or replace] trigger 触发器名
{before|after}
{delete|insert|update [of 列名]}
on 表名
[for each row [when 条件]]
plsql块
```
### 6.触发器的案例
* 触发器案例一：禁止在非工作时间插入数据
* 触发器案例二：涨工资不能越涨越少    `:old`和`:new`的使用要注意。
* 触发器案例三：创建基于值的触发器
* 触发器案例四：数据库的备份和同步    --利用触发器实现数据的同步备份，多用于异地分布式数据库
还能使用快照备份，快照备份是异步备份，而触发器是同步备份，没有延时的
=====================================================================================
## Oracle存储过程部分
### 1.存储过程模板公式
```
create [or replace] PROCEDURE 过程名(参数列表)
AS
PLSQL子程序体; （关键字可以小写）（如果不传参，则参数列表的小括号也可以省略）
```
这个PLSQL子程序体;一般为：
```
begin
	代码...
end;
/
```
 **如果写的是存储函数，那么这里的PROCEDURE需要改成FUNCTION，而且必须在参数列表和AS之间添加一句：`RETURN 函数值类型`。而且需要在子程序体需要返回的时候写`return 返回值`。** 

写好之后先编译，然后调用、运行。

as后面跟的是说明部分，相当于declare。

as也可以写成is。

调用方式有两种：

（1）`exec 过程名();`

（2）
```
begin
    调用语句;
end;
/
```
### 2.入参
在参数列表中，如果是输入参数，可以写入eno in number，in是关键，in前面是变量名，后面是变量类型。
### 3.出参
如果是输出参数，写eno out number，out是关键，out前面是变量名，后面是变量类型。

存储过程和存储函数都可以有out参数。

他们都可以有多个out参数。

存储过程可以通过out参数来实现返回值。
### 4.小例子
查询某个员工姓名、月薪和职位
```
create or replace procedure queryempinform(eno in number,
			pename out varchar2,
			psal   out number,
			pjob   out varchar2)
as
begin
	--得到该员工的姓名、月薪和职位
	select ename,sal,empjob into pename,psal,pjob from emp where empno=eno;
end;
/
```
### 5.在out参数中使用光标案例
案例：查询某个部门中所有员工的所有信息。

包头（负责声明包中的结构）：
```
CREATE OR REPLACE PACKAGE MYPACKAGE AS
	type empcursor is ref cursor;
	procedure queryEmpList(dno in number,empList out empcursor);
END MYPACKAGE;
```
注意：包头中也可以不定义存储过程，只定义光标那一行。

包体（负责写需要实现包头中声明的所有方法）：
```
CREATE OR REPLACE PACKAGE BODY MYPACKAGE AS
	procedure queryEmpList(dno in number,empList out empcursor) AS
	BEGIN
		--打开光标类型（是一个集合，意味着可以返回许多信息的集合）
		open empList for select * from emp where deptno=dno;
	END queryEmpList;
END MYPACKAGE;
```
注意：包体里面的存储过程也可以不写在包体内部也可以一样调用包头中定义的光标。

### 6.其他小知识点
* 参数列表可以换行，也可以在关键字之间多加空格。
* 如果是没有参数的就是存储过程，如果有参数就是存储函数。存储函数可以有一个返回值，可以用return子句进行返回。
* 我们的原则是，如果只需要一个返回值，则用存储函数。如果没有返回值，用存储过程，如果需要有多个返回值，则使用存储过程，在参数中使用out参数。
* 单行注释使用“--注释内容”，多行注释使用“/* 注释内容 */”。
* 调试的时候授予权限：

哪个权限没有就到sqlplus输入如下代码：
```
grant 要调的权限（中间用逗号分隔） to 用户名;
```
* 如果在计算中可能会有空值的话需要使用nvl预空函数。
=====================================================================================
## 其他独立知识点
一些不知道插进过去的哪些笔记的笔记就放在这里吧~
### 简单EXISTS和 NOT EXISTS讲解和案例
以
```
select * from A where exists(select * from B where A.a=B.a)
```
为例,
exists表示,对于A中的每一个记录,如果,在表B中有记录,其属性a的值与表A这个记录的属性a的值相同,则表A的这个记录是符合条件的记录, 

如果是NOT exists,则表示如果表B中没有记录能与表A这个记录连接,则表A的这个记录是符合条件的记录。

