class Singleton {
    // Appraoch 1
    // private static final Singleton INSTANCE = new Singleton();
    // private Singleton() {
    //     System.out.println("Appraoch 1: Singleton Instance Created");
    // }
    // public static Singleton getInstance() {
    //     return INSTANCE;
    // }
    // Approach 2: Lazy Initialization but not thread safe
    // private static Singleton instance;
    // private Singleton() {
    //     System.out.println("Appraoch2: Singleton Instance Created");
    // }
    // public static Singleton getInstance() {
    //     if (instance == null) {
    //         instance = new Singleton();
    //     }
    //     return instance;
    // }
    // thread safe but slow
    // private static Singleton instance;

    // private Singleton() {
    //     System.out.println("Appraoch3: Singleton Instance Created");
    // }

    // public static synchronized Singleton getInstance() {
    //     if (instance == null) {
    //         instance = new Singleton();
    //     }
    //     return instance;
    // }
    // Appraoch 4:
    private static volatile Singleton instance;
    private Singleton() {
        System.out.println("Appraoch4: Singleton Instance Created");
    }
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}

