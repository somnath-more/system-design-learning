### Approach 1
- ✔ Thread-safe
- ✔ Simple
- ❌ Instance created even if never used
### Approach 2
Thread-safe
- ❌ Multiple threads can create multiple instances
- ❌ Avoid in production
### Approach 3
- ✔ Thread-safe
- ❌ Slower due to synchronization

### Approach 4
- ✔ Thread-safe
- ✔ Lazy
- ✔ High performance
- ✔ Used in real systems

What is volatile used for in Java?

volatile is used to ensure visibility of a variable across multiple threads.

👉 When one thread updates a volatile variable, all other threads immediately see the updated value.