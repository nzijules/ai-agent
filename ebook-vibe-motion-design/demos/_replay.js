document.querySelector('.replay')?.addEventListener('click',()=>{document.getAnimations().forEach(a=>{a.cancel();a.play();});});
