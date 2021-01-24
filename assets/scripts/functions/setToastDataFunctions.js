export function setToastDataFunctions(bool, message, className) {
  M.toast({
    html: 'リロードします・・・',
    displayLength: 5000,
    classes: 'toast-success toast-pop',
  });
  const toastObject = {
    bool,
    message,
    className,
  };
  const toastJSON = JSON.stringify(toastObject);
  localStorage.setItem('toast_to_show', toastJSON);
  setTimeout(() => {
    location.reload()
  }, 1000);
}
