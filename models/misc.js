// alert('This is a pop-up message!');

var selects=document.querySelectorAll('.tab');

console.log(selects);

selects.forEach(select => {
    var id=select.getAttribute("id")
    select.addEventListener('click', function() {

      console.log(id);
 
      fetch('/testr', {
          
          
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({idx:id}), // Send the data object, not index directly
      }).
      then(response => {
          console.log(response);
          if (!response.ok) {
              throw new Error('Network response was not ok', index);
          }
          // box.classList.add('kire'); 
          console.log("SUCCESS");
          window.location.reload()
          return response.json(); // Parse response as JSON
      })
      
      


    });
  });



selects.forEach(tab => {
    
    
    tab.addEventListener('click',()=>{
        var ids=selects.getAttribute("id")
        console.log('sel1__SNEDING>>>>');

    
    
})

});







