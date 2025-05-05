// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ntmuznsceqhiytbmfmox.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bXV6bnNjZXFoaXl0Ym1mbW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTM3MDAsImV4cCI6MjA2MTk4OTcwMH0.pG__6FJgAMHsJITtwkLKIeeginEGeT6TUxv8Vq3dYvg'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Success Notification 
function successNotification(message, seconds = 0) {
  document.querySelector('.alert-success').classList.remove('d-none')
  document.querySelector('.alert-success').classList.add('d-block')
  document.querySelector('.alert-success').innerHTML = message

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector('.alert-success').classList.remove('d-block')
      document.querySelector('.alert-success').classList.add('d-none')
    }, seconds * 1000)
  }
}

// Error Notification
function errorNotification(message, seconds = 0) {
  document.querySelector('.alert-danger').classList.remove('d-none')
  document.querySelector('.alert-danger').classList.add('d-block')
  document.querySelector('.alert-danger').innerHTML = message

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector('.alert-danger').classList.remove('d-block')
      document.querySelector('.alert-danger').classList.add('d-none')
    }, seconds * 1000)
  }
}

export { supabase, successNotification, errorNotification }
