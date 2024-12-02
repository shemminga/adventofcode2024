import static java.lang.Integer.parseInt;
import static java.lang.System.nanoTime;
import static java.lang.System.out;
import static java.util.function.Predicate.not;

void main() throws Exception {
    doFile("input-test1.txt");
    doFile("input.txt");
    out.printf("*** %s *** DONE ***%n", LocalTime.now());
}

static final Pattern SEPARATOR = Pattern.compile(" {3}");

long fileStartTime = 0;
boolean test = false;

void doFile(String filename) throws Exception {
    out.printf("*** %s *** input file: %s ***%n", LocalTime.now(), filename);
    test = filename.contains("test");
    fileStartTime = nanoTime();

    var uri = getClass().getResource(filename)
            .toURI();
    try (var lines = Files.lines(Paths.get(uri))) {
        var input = lines.filter(not(String::isBlank))
                .map(String::trim)
                .map(SEPARATOR::split)
                .map(xs -> new int[]{parseInt(xs[0]), parseInt(xs[1])})
                .toList();

        int[] list1 = input.stream().mapToInt(xs -> xs[0]).sorted().toArray();
        int[] list2 = input.stream().mapToInt(xs -> xs[1]).sorted().toArray();


        int solution = 0;
        for (int i = 0; i < list1.length; i++)
            solution += Math.abs(list1[i] - list2[i]);

        out.println("solution = " + solution);
        out.printf("%,5d ns%n", nanoTime() - fileStartTime);
    }

    out.println();
}
