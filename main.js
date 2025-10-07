const lengthInput = document.getElementById("length");
const generateBtn = document.getElementById("generate");
const  passwordResult = document.getElementById("password");



lengthInput.addEventListener("input" , function () {

let value = lengthInput.value ;
//remove Non Digit Characters
//عدم ظهور الحروف و اظهار الارقام فقط
value = value.replace(/\D/g, "");

// force Range 

if (value !== "") {
    //خلي العدد 1 او اكثر و اقل من 32
value = Math.max(1 , Math.min(32 ,parseInt(value)))}


lengthInput.value = value;
})

//set a default valur if trhe fielid empty
lengthInput.addEventListener("blur" , function () {
if (lengthInput.value === "") lengthInput.value =10;
})


// Generate Password Function

function generatePassword(length, includeNumbers, includeSpecial) {

    //نحط كل الارقام و الحروف في متعيرات
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:',.<>?";

  let characterPool = lowercase + uppercase;
  if (includeNumbers) characterPool += numbers;
  if (includeSpecial) characterPool += special;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterPool.length);
    //هيجيب الارقام العشوائية
    password += characterPool[randomIndex];
  }

  return password;
}



// console.log(generatePassword(20, false, true));

// Click On Generate Button
generateBtn.addEventListener("click", function () {
  // Get Password Length
  let length = parseInt(lengthInput.value); 

  // console.log(length);
  const includeNumbers = document.getElementById("include-numbers").checked;
  const includeSpecial = document.getElementById("include-special").checked;

//  console.log(includeNumbers);
   //console.log(includeSpecial);

  // Get Random Password From Generate Password Function
  const password = generatePassword(length, includeNumbers, includeSpecial);

  passwordResult.textContent = password;
  savePassword(password);
   displaySavedPassword();

});

//save password
function savePassword(password) {
  const savedPassword = JSON.parse(localStorage.getItem("passwords")) ||[];
   // console.log(savedPassword);
  savedPassword.unshift(password)  //تظهر الارقام في بدايه المصفوفه
 if (savedPassword.length> 10) savedPassword.pop(); // ظهور 10 ارقام فقط و لو في ارقام اكتر يتم ىحذف من نهاية المصفوفه
  localStorage.setItem("passwords" , JSON.stringify(savedPassword))
}


//display saved password
function displaySavedPassword() {
  const savedPassword = JSON.parse(localStorage.getItem("passwords")) || [];
  const listOfPassword = savedPassword.map((password, i) => `<div><span>${i + 1}</span>${escapeHTML(password)}
  <button class="delete-btn" data-index="${i}">Delete</button>
  </div>`).join("");
  document.getElementById("saved-passwords").innerHTML = listOfPassword || " Passwords Will Show Here";
}

document.getElementById("saved-passwords").addEventListener("click", function(e) {


  if (e.target.classList.contains("delete-btn")){

    const index = parseInt(e.target.dataset.index);
      deletePassword(index);
  }
})

// Delete password function
function deletePassword(index) {
  const savedPassword = JSON.parse(localStorage.getItem("passwords")) || [];
  savedPassword.splice(index, 1);
  localStorage.setItem("passwords", JSON.stringify(savedPassword));
  displaySavedPassword();
}


function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

//if password strength
function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return strength;
}

function updatePasswordStrength(password) {
  const strength = checkPasswordStrength(password);
  const strengthText = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
  const strengthColors = ["#ff4757", "#ffa502", "#ffdd59", "#2ed573", "#1e90ff"];
  const strengthPercent = (strength / 5) * 100;
  
  const strengthElement = document.getElementById("password-strength");
  const strengthBar = document.getElementById("strength-bar");
  
  if (strengthElement) {
    strengthElement.textContent = `Strength: ${strengthText[strength]}`;
    strengthElement.style.color = strengthColors[strength];
  }
  
  if (strengthBar) {
    strengthBar.style.width = `${strengthPercent}%`;
    strengthBar.style.backgroundColor = strengthColors[strength];
  }
}

// Update event listener
generateBtn.addEventListener("click", function() {
  let length = parseInt(lengthInput.value); 
  const includeNumbers = document.getElementById("include-numbers").checked;
  const includeSpecial = document.getElementById("include-special").checked;

  const password = generatePassword(length, includeNumbers, includeSpecial);
  passwordResult.textContent = password;
  
  // Update strength indicator
  updatePasswordStrength(password);
  
  savePassword(password);
  displaySavedPassword();
});





// === دوال حذف الكل === //

function deleteAllPasswords() {
    const savedPasswords = JSON.parse(localStorage.getItem("passwords")) || [];
    
    if (savedPasswords.length === 0) {
        alert("No passwords to delete!");
        return;
    }
    
    const isConfirmed = confirm(`Are you sure you want to delete ALL ${savedPasswords.length} saved passwords?\n\nThis action cannot be undone.`);
    
    if (isConfirmed) {
        localStorage.removeItem("passwords");
        displaySavedPassword();
        alert("All passwords have been deleted successfully!");
    }
}

function updateDeleteButtonState() {
    const deleteAllBtn = document.getElementById("delete-all-btn");
    const savedPasswords = JSON.parse(localStorage.getItem("passwords")) || [];
    
    if (deleteAllBtn) {
        deleteAllBtn.disabled = savedPasswords.length === 0;
        
        if (savedPasswords.length === 0) {
            deleteAllBtn.textContent = "🗑️ No Passwords to Delete";
        } else {
            deleteAllBtn.textContent = `🗑️ Delete All (${savedPasswords.length})`;
        }
    }
}

// === تحديث الدوال الحالية === //

function displaySavedPassword() {
  const savedPassword = JSON.parse(localStorage.getItem("passwords")) || [];
  const listOfPassword = savedPassword.map((password, i) => `<div><span>${i + 1}</span>${escapeHTML(password)}
  <button class="delete-btn" data-index="${i}">Delete</button>
  </div>`).join("");
  document.getElementById("saved-passwords").innerHTML = listOfPassword || " Passwords Will Show Here";
  
  updateDeleteButtonState(); // تحديث حالة الزر
}

// === إضافة الأحداث === //

document.addEventListener("DOMContentLoaded", function() {
    displaySavedPassword();
    updateDeleteButtonState(); // تحديث حالة الزر عند تحميل الصفحة
});

document.getElementById("delete-all-btn").addEventListener("click", deleteAllPasswords);




//display passwords on page load
document.addEventListener("DOMContentLoaded" , displaySavedPassword);


