/*人物*/
function person(can,cobj,runimg,jumpimg){
    this.can=can;
    this.cobj=cobj;
    this.runimg=runimg;
    this.jumpimg=jumpimg;
    this.state="runimg";
    this.status=0;
    this.life=5;
    this.x=0;
    this.y=380;
    this.width=150;
    this.height=200;
}
person.prototype={
    draw: function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.state][this.status],0,0,150,200,0,0,150,200);
        this.cobj.restore();
    }
};
/*障碍物1*/
function hinder(can,cobj,hinderimg,jbimg,gsimg){
    this.can=can;
    this.cobj=cobj;
    this.hinderimg=hinderimg;
    this.jbimg=jbimg;
    this.gsimg=gsimg;
    this.x=1300;
    this.y=500;
    this.startx=300;
    this.starty=300;
    this.width=60;
    this.height=60;
    this.hinderArr=[];
    this.state="hinderimg";
    this.status=0;
}
hinder.prototype={
    draw: function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.state][this.status],0,0,this.startx,this.starty,0,0,this.width,this.height);
        this.cobj.restore();
    }
};

/*血*/
var xt;
function particle(can,cobj,x,y){
    this.can=can;
    this.cobj=cobj;
    this.x=x;
    this.y=y;
    this.r=2+5*Math.random();
    this.time=2+2*Math.random();
}
particle.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.beginPath();
        this.cobj.fillStyle="red";
        this.cobj.arc(0,0,this.r,0,2*Math.PI);
        this.cobj.fill();
        this.cobj.restore();
    },
    update:function(){
        this.speedx=-3+6*Math.random();
        this.speedy=-3+6*Math.random();
        this.x+=this.speedx;
        this.y+=this.speedy;
        this.time-=0.1;
        this.r-=0.2;
    }
}
function xue(can,cobj,x,y){
    var xuenum=10+Math.floor(15*Math.random());
    var xueArr=[];
    for(var i=0;i<xuenum;i++){
        xueArr.push(new particle(can,cobj,x,y));
    }
     xt=setInterval(function(){
        cobj.clearRect(0,0,can.width,can.height);
        for(var i=0;i<xueArr.length;i++){
            xueArr[i].draw();
            xueArr[i].update();
            if(xueArr[i].time<0||xueArr[i].r<0){
                xueArr.splice(i,1);
                clearInterval(xt);
            }

        }
    },100);
}

/*游戏控制*/
function play(can,cobj,runimg,jumpimg,hinderimg,jbimg,gsimg){
    this.can=can;
    this.cobj=cobj;
    this.hinderimg=hinderimg;
    this.jbimg=jbimg;
    this.gsimg=gsimg;
    this.person=new person(can,cobj,runimg,jumpimg);
    this.speed=10;
    this.speedb=11;
    this.speed1=15;
    this. hinderArr=[];
    this. hinderArr1=[];
}
play.prototype={
    playgame: function () {
        var that=this;
        var num1=0;
        var time=0;
        var time1=0;
        var step=Math.floor(6*Math.random())*1000;
        var pos=0;
        var life=$('#life').find('span').html();
        var score=$('#score').find('span').html();
        var pore=3;
        var hinderobj1;
        var w=setInterval(function(){
            that.cobj.clearRect(0,0,that.can.width,that.can.height);
            /*人物*/
            num1++;
            if(that.person.state=="runimg") {
                that.person.status = num1 %13;
            }else{
                that.person.status = 0;
            }
            that.person.x+=that.speed;
            if(that.person.x>=that.can.width/3){
                that.person.x=that.can.width/3;
            }
            that.person.draw();
            /*障碍物*/
            time+=50;
            time1+=80;
            var nn=0;
            if(time1%step==0) {
                step =3000 + Math.floor(6 * Math.random()) * 1000;
                var hinderobj = new hinder(that.can, that.cobj, that.hinderimg, that.jbimg);
                if (score >= 6) {
                    hinderobj1 = new hinder(that.can, that.cobj, that.hinderimg, that.jbimg, that.gsimg);
                    hinderobj1.state = "gsimg";
                    hinderobj1.y = 500;
                    hinderobj1.startx = 100;
                    hinderobj1.starty = 100;
                    hinderobj1.width = 50;
                    hinderobj1.height = 50;
                    hinderobj1.status = num1 % 6;
                    that.hinderArr1.push(hinderobj1);
                }
            }
            if(time%step==0){
                step=3000+Math.floor(6*Math.random())*1000;
                var hinderobj=new hinder(that.can,that.cobj,that.hinderimg,that.jbimg);
                if(score>=5){
                    $('canvas').css('background','url(img/bjt.jpg) repeat-x');
                    hinderobj.state="jbimg";
                    hinderobj.y=250;
                    hinderobj.startx=100;
                    hinderobj.starty=100;
                    hinderobj.width=100;
                    hinderobj.height=100;
                }else{
                    hinderobj.state="hinderimg";
                }
                if(hinderobj.state=="hinderimg"){
                    hinderobj.status=num1%9;
                }else if(hinderobj.state=="jbimg"){
                    hinderobj.status=num1%26;
                }
                that.hinderArr.push(hinderobj);
            }
            for(var i=0;i<that.hinderArr1.length;i++) {
                that.hinderArr1[i].x -= that.speed1;
                that.hinderArr1[i].draw();
                if(hitPix(that.can,that.cobj,that.hinderArr1[i],that.person)){
                    if(!that.hinderArr1[i].flag){
                        life-=1;
                        $('#life').find('span').html(life);
                        xue(that.can,that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                        $('#lose1')[0].play();
                        that.hinderArr1[i].flag=true;
                        if(life<=0){
                            $('#pass').animate({'top':0},1000,function(){
                                clearInterval(w);
                                clearInterval(xt);
                            })
                            life=0;
                            $('#life').find('span').html(life);
                        }
                    }
                }
                var star=$('star');
                if(that.person.x>that.hinderArr1[i].x+that.hinderArr1[i].width&&!that.hinderArr1[i].flag&&!that.hinderArr1[i].flag1){
                    $('#music1')[0].pause();
                    $('#music2')[0].play();
                    score++;
                    pore+=3;
                    if(pore>=228){
                        pore==228;
                    }
                    $('.inn').animate({'width':pore})
                    that.hinderArr1[i].flag1=true;
                    $('#score').find('span').html(score);
                    if(score%5==0){
                        life++;
                        $('#life').find('span').html(life);
                    }

                    if(score>=10){
                        var star=$('dd');
                         for(var i=0;i<star.length;i++){
                            if(score%10==i){
                                star[i].style.display="block";
                            }
                        }
                    }
                }
            }
            for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.speedb;
                that.hinderArr[i].draw();
                if(hitPix(that.can,that.cobj,that.hinderArr[i],that.person)){
                    if(that.hinderArr[i].state=="jbimg"){
                        that.hinderArr[i].y=-120;
                        $('#sl')[0].play();
                    }
                    if(!that.hinderArr[i].flag){
                        if(that.hinderArr[i].state=="jbimg"){
                            score++;
                            pore+=3;
                            if(pore==228){
                                pore=228;
                            }
                            $('#score').find('span').html(score);
                            $('.inn').animate({'width':pore})
                            if(score%5==0){
                                life++;
                                $('#life').find('span').html(life);
                            }
                        }else{
                            life-=1;
                            $('#life').find('span').html(life);
                        }
                        if(that.hinderArr[i].state=="hinderimg"){
                            xue(that.can,that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                            $('#lose1')[0].play();
                        }
                        that.hinderArr[i].flag=true;
                        if(life<=0){
                            $('#pass').animate({'top':0},1000,function(){
                                clearInterval(w);
                                clearInterval(xt);
                            })
                            life=0;
                            $('#life').find('span').html(life);
                        }
                    }

                }
                if(that.hinderArr[i].state=="hinderimg"){
                    if(that.person.x>that.hinderArr[i].x+that.hinderArr[i].width&&!that.hinderArr[i].flag&&!that.hinderArr[i].flag1){
                        $('#music1')[0].pause();
                        $('#music2')[0].play();
                        score++;
                        pore+=3;
                        $('.inn').animate({'width':pore})
                        that.hinderArr[i].flag1=true;
                        $('#score').find('span').html(score);
                        if(score%5==0){
                            life++;
                            $('#life').find('span').html(life);
                        }
                    }else{
                        $('#music1')[0].play();
                    }
                }
            }
            /*背景*/
            pos+=that.speed;
            that.can.style.backgroundPositionX=-pos+"px";
        },50)
    },
    key: function () {
        var angle=0;
        var r=150;
        var persony=this.person.y;
        var that=this;
        var flag=true;

        document.onkeydown= function (e) {
            if(e.keyCode==13){
                if(!flag) return;
                flag=false;
                var t=setInterval(function () {
                    angle+=6;
                    var jumpy=r*Math.sin(angle*Math.PI/180);
                    that.person.y=persony-jumpy;
                    that.person.state="jumpimg";
                    if(angle>=180){
                        angle=0;
                        clearInterval(t);
                        flag=true;
                        that.person.state="runimg";
                    }
                },50);
            }
        }
    }
};


