function main() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('Your browser does not support WebGL');
        return;
    }

    // Dikdörtgen çizme fonksiyonu
    function drawRectangle(x, y, width, height) {
        return [
            x, y, 0.0,
            x + width, y, 0.0,
            x, y - height, 0.0,
            x, y - height, 0.0,
            x + width, y, 0.0,
            x + width, y - height, 0.0
        ];
    }

    // Üçgen çizme fonksiyonu
    function drawTriangle(x1, y1, x2, y2, x3, y3) {
        return [
            x1, y1, 0.0,
            x2, y2, 0.0,
            x3, y3, 0.0
        ];
    }

    // Harfleri tanımlamak için dikdörtgen ve üçgen fonksiyonlarını kullanıyoruz
    const vertices = new Float32Array([
        // Z harfi
        ...drawRectangle(-0.9, 0.4, 0.2, 0.05),  // Üst yatay çizgi
        ...drawRectangle(-0.9, 0.15, 0.2, 0.05), // Alt yatay çizgi
        ...drawTriangle(-0.7, 0.4, -0.9, 0.15, -0.7, 0.35),  // Eğik çizgi üçgeni birinci yarısı        
        ...drawTriangle(-0.7, 0.4, -0.9, 0.15, -0.9, 0.1), 
        // E harfi
        ...drawRectangle(-0.65, 0.4, 0.15, 0.05),
        ...drawRectangle(-0.65, 0.275, 0.15, 0.05),
        ...drawRectangle(-0.65, 0.15, 0.15, 0.05),
        ...drawRectangle(-0.65, 0.4, 0.05, 0.25),
        // Y harfi
        ...drawRectangle(-0.4, 0.4, 0.05, 0.125),
        ...drawRectangle(-0.25, 0.4, 0.05, 0.175),
        ...drawRectangle(-0.4, 0.275, 0.15, 0.05),
        ...drawRectangle(-0.325, 0.275, 0.05, 0.175),
        // N harfi
        ...drawRectangle(-0.15, 0.4, 0.05, 0.3),
        ...drawRectangle(-0.15, 0.4, 0.15, 0.05),
        ...drawRectangle(0.0, 0.4, 0.05, 0.3),
        // E harfi
        ...drawRectangle(0.15, 0.4, 0.15, 0.05),
        ...drawRectangle(0.15, 0.275, 0.15, 0.05),
        ...drawRectangle(0.15, 0.15, 0.15, 0.05),
        ...drawRectangle(0.15, 0.4, 0.05, 0.25),
        // P harfi
        ...drawRectangle(0.35, 0.4, 0.15, 0.05),
        ...drawRectangle(0.35, 0.275, 0.2, 0.05),
        ...drawRectangle(0.5, 0.4, 0.05, 0.125),
        ...drawRectangle(0.35, 0.4, 0.05, 0.3),
        // S harfi
        ...drawRectangle(0.6, 0.4, 0.15, 0.05),
        ...drawRectangle(0.6, 0.275, 0.1, 0.05),
        ...drawRectangle(0.6, 0.35, 0.05, 0.1),
        ...drawRectangle(0.6, 0.15, 0.15, 0.05),
        ...drawRectangle(0.7, 0.275, 0.05, 0.15),
        // U harfi
        ...drawRectangle(0.8, 0.4, 0.05, 0.25),
        ...drawRectangle(0.9, 0.4, 0.05, 0.25),
        ...drawRectangle(0.8, 0.15, 0.15, 0.05),
    ]);

    const vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const vertCode = `
        attribute vec3 coordinates;
        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
        }
    `;
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertShader));
        return;
    }

    const fragCode = `
        void main(void) {
            gl_FragColor = vec4(1.0, 0.75, 0.8, 0.65);  
        }
    `;
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader));
        return;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
        return;
    }

    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    gl.clearColor(0.68, 0.85, 0.90, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}

window.onload = main;
