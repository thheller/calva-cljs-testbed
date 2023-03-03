import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
export function run() {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'tdd',
        color: true
    });
    const testsRoot = path.resolve(__dirname, '..');
    return new Promise((c, e) => {
        glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
            if (err) {
                return e(err);
            }
            // Add files to the test suite
            files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));
            try {
                // Run the mocha test
                mocha.run(failures => {
                    if (failures > 0) {
                        e(new Error(`${failures} tests failed.`));
                    }
                    else {
                        c();
                    }
                });
            }
            catch (err) {
                console.error(err);
                e(err);
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUU3QixNQUFNLFVBQVUsR0FBRztJQUNsQix3QkFBd0I7SUFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUM7UUFDdkIsRUFBRSxFQUFFLEtBQUs7UUFDVCxLQUFLLEVBQUUsSUFBSTtLQUNYLENBQUMsQ0FBQztJQUVILE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRWhELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN4RCxJQUFJLEdBQUcsRUFBRTtnQkFDUixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNkO1lBRUQsOEJBQThCO1lBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RCxJQUFJO2dCQUNILHFCQUFxQjtnQkFDckIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDcEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO3dCQUNqQixDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxRQUFRLGdCQUFnQixDQUFDLENBQUMsQ0FBQztxQkFDMUM7eUJBQU07d0JBQ04sQ0FBQyxFQUFFLENBQUM7cUJBQ0o7Z0JBQ0YsQ0FBQyxDQUFDLENBQUM7YUFDSDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNQO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMifQ==