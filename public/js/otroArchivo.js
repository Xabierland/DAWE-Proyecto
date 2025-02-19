export function canvas(context) {

    let w = 300;
    let h = 100;
    let xinic = 100;
    let yinic = 100;
    let x = xinic;
    let y = yinic;
    let ycont = 1;
    let xcont = 1;
    let lado = 0; //0 para lado vertical, 1 para horizontal
    let dir = 0; //0 abajo o derecha, 1 arriba o izq
    let xupleft = xinic;
    let yupleft = yinic;

    let xupright = xinic + w;
    let yuright = yinic;
    
    let xdownleft = xinic;
    let ydownleft = yinic + h;

    let xdownright = xinic + w;
    let ydownright = yinic + h;
    context.clearRect(xinic,yinic,w,h);

    context.beginPath();
    while(True) {
        break;
        if(lado){
            if(dir){

            }else{

            }
        }else{
            if(dir){
                while(ycont<h){
                    context.moveTo(xdownright,ydownright)
                    context.lineTo(xupleft,y+ycont);
                    context.stroke()
                    context.clearRect(0, 0, w, h);
                    ycont++;
                }
                while(ycont!=1){
                    context.moveTo(xupleft,yupleft+(h-ycont));
                    context.lineTo(xupleft,h)
                    context.stroke()
                    context.clearRect(0, 0, w, h);
                    ycont=ycont-1;
                }
            }else{
                while(ycont<h){
                    context.moveTo(0,0)
                    context.lineTo(0,ycont);
                    context.stroke()
                    context.clearRect(0, 0, w, h);
                    ycont++;
                }
                while(ycont!=1){
                    context.moveTo(0,(h-ycont));
                    context.lineTo(0,h)
                    context.stroke()
                    context.clearRect(0, 0, w, h);
                    ycont=ycont-1;
                }
            }
        }
        context.lineTo(xcont,ycont)
        context.stroke()
    }

    return true;
}


export function canvas2(context) {

    let posicionInicioX = 0;
    let posicionInicioY = 0;


    let distanciaLineaActual = 0;
    let distanciaLinea = 100;

    let frameTime = 200;

    while (true)
    {
        while(distanciaLineaActual < distanciaLinea)
        {
            distanciaLineaActual += 1;
            dibujarLinea(context, posicionInicioX, posicionInicioY , posicionInicioX, posicionInicioY + distanciaLineaActual)
            setTimeout(() => {}, frameTime);
        }
        distanciaLineaActual = 0;
        while(distanciaLineaActual <  distanciaLinea)
        {
            distanciaLineaActual += 1;
            dibujarLinea(context, posicionInicioX + distanciaLineaActual, posicionInicioY , posicionInicioX, posicionInicioY + distanciaLinea)
            setTimeout(() => {}, frameTime);
        }

        distanciaLineaActual = 0;
        while(distanciaLineaActual < distanciaLinea)
        {
            distanciaLineaActual += 1;
            dibujarLinea(context, posicionInicioX + distanciaLinea, posicionInicioY , posicionInicioX, posicionInicioY+distanciaLineaActual)
            setTimeout(() => {}, frameTime);
        }
        distanciaLineaActual = 0;
        while(distanciaLineaActual <  distanciaLinea)
        {
            distanciaLineaActual += 1;
            dibujarLinea(context, posicionInicioX + distanciaLinea, posicionInicioY+distanciaLineaActual , posicionInicioX, posicionInicioY + distanciaLinea)
            setTimeout(() => {}, frameTime);
        }
    }

    return true;


    function dibujarLinea(context, xInicio, yInicio, xFinal, yFinal)
    {
        context.beginPath();
        context.moveTo(xInicio,xFinal); 
        context.lineTo(yInicio,yFinal); 
        context.lineWidth = 3; 
        context.stroke(); 
    }
}