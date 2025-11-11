export function isLoggedIn(){
  return localStorage.getItem('isLoggedIn') === '1'
}

export function login(password){
  // admin password stored in localStorage for this simple demo
  const saved = localStorage.getItem('adminPassword')
  if(!saved){
    // no password set yet - set this one
    localStorage.setItem('adminPassword', password)
    localStorage.setItem('isLoggedIn','1')
    return true
  }
  if(password === saved){
    localStorage.setItem('isLoggedIn','1')
    return true
  }
  return false
}

export function logout(){
  localStorage.removeItem('isLoggedIn')
}
