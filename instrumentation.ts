export function register() {
  console.log('========================================================================');
  console.log(`[Brixstone ZESCO Calculator] Application started successfully at ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${process.env.PORT || 3000}`);
  console.log('========================================================================');
}
