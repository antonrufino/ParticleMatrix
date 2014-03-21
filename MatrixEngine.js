/*
	A clone of Particles Web Matrix by Kushagra Agarwal
    Copyright (C) 2014  Anton Rufino

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var MatrixEngine = (function() 
{
	var canvas, ctx;
	var particles = []
	var numParticles = 0;
	var maxParticles = 150;
	var lastSpawn, now;
	
	var mx, my;
	
	var radius;
	var dx, dy;
	var minDist = 100;
	var mousedown = false
	
	function mouseMoveHandler(e)
	{
		e.preventDefault();
		mx = e.clientX;
		my = e.clientY;
	}
	
	function mouseDownHandler(e)
	{
		e.preventDefault();
		console.log('down');
		mousedown = true
	}
	
	function mouseUpHandler(e)
	{
		e.preventDefault();
		console.log('up');
		mousedown = false;
	}
	
	function setUpCanvas() 
	{
		canvas = document.getElementById('feild');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
		}
	}
	
	function Particle(x, y) 
	{
		this.x = x;//;
		this.y = y;//;
		
		this.vx = -1 + Math.random() * 3;
		this.vy = -1 + Math.random() * 3;
		
		this.radius = 4;
		this.opacity = 0.7;
	}
	
	function DistanceHandler(p1, p2)
	{
		dx = p2.x - p1.x;
		dy = p2.y - p1.y;
		
		var dist = Math.sqrt(dx * dx + dy * dy);
		
		if (dist <= minDist) {
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.strokeStyle = 'rgba(255, 255, 255, ' + (1.2 - dist/minDist) + ')';
			ctx.lineTo(p2.x, p2.y);
			ctx.closePath();
			ctx.stroke();
			
			var ax = dx/2000;
			var ay = dy/2000;
			
			p1.vx -= ax;
			p1.vy -= ay;
			
			p2.vx += ax;
			p2.vy += ay;
		}
	}
	
	function run() 
	{	
		if (mousedown == true) {
			now = new Date().getTime();
			if ((now - lastSpawn) >= 0) {
				particles.push(new Particle(mx, my));
				lastSpawn = now;
				++numParticles
			}
		}
		
		if (numParticles > maxParticles) {
			particles.splice(0, 1);
			numParticles -= 1;
		}
		
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = 'lighter';
		
		for (var i = 0; i < particles.length; ++i) 
		{
			var p = particles[i]
			
			ctx.beginPath();
			ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
			ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
			ctx.fill();
			
			if (p.vx > 4) {
				p.vx = -1 + Math.random() * 3;
			}
			
			if (p.vy > 4) {
				p.vy = -1 + Math.random() * 3;
			}
				
			p.x += p.vx;
			p.y += p.vy;
			
			if ((p.x + p.radius) > canvas.width || (p.x - p.radius) < 0) {
				p.x = Math.random() * canvas.width;
			}
			
			if  ((p.y + p.radius) > canvas.height || (p.y - p.radius) < 0) {
				p.y = Math.random() * canvas.height;
			}
			
			for (var j = i + 1; j < particles.length; ++j) {
				var p2 = particles[j];
				
				DistanceHandler(p, p2);
			}
		}
		
		//setTimeout(run, 1000/60)
		window.webkitRequestAnimationFrame(run);
	}
	
	function windowResizeHandler() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
	return {
		init: function() 
		{
			setUpCanvas();
			lastSpawn = 0
			canvas.addEventListener('mousemove', mouseMoveHandler, false);
			canvas.addEventListener('mousedown', mouseDownHandler, false);
			canvas.addEventListener('mouseup', mouseUpHandler, false);
			window.addEventListener('resize', windowResizeHandler, false);
			run();
		}
	};
})()

window.addEventListener('load', MatrixEngine.init, false);
