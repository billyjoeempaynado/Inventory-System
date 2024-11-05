

export function showAlertMessage(message, type) {
 
  if (type === 'success') {
    alertify.success(message);  // Success alert
} else if (type === 'error') {
    alertify.error(message);  // Error alert
} else if (type === 'warning') {
    alertify.warning(message);  // Warning alert
} else if (type === 'danger') {
    alertify.error(message);  // Using error for danger in Alertify
} else if (type === 'message') {
    alertify.message(message);  // General message alert
}

alertify.set('notifier', 'position', 'top-right');  // Set position of notifications
alertify.set('notifier', 'delay', 3); 
}




