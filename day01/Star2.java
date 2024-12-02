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
                .map(xs -> new long[]{parseInt(xs[0]), parseInt(xs[1])})
                .toList();

        long[] list1 = input.stream().mapToLong(xs -> xs[0]).sorted().toArray();
        long[] list2 = input.stream().mapToLong(xs -> xs[1]).sorted().toArray();

        long solution = Arrays.stream(list1)
                .map(x1 -> x1 * Arrays.stream(list2)
                        .filter(x2 -> x1 == x2)
                        .count())
                .sum();

        out.println("solution = " + solution);
        out.printf("%,5d ns%n", nanoTime() - fileStartTime);
    }

    out.println();
}
