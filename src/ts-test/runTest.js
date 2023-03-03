var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as path from 'path';
import { runTests } from '@vscode/test-electron';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // The folder containing the Extension Manifest package.json
            // Passed to `--extensionDevelopmentPath`
            const extensionDevelopmentPath = path.resolve(__dirname, '../../');
            // The path to test runner
            // Passed to --extensionTestsPath
            const extensionTestsPath = path.resolve(__dirname, './suite/index');
            // Download VS Code, unzip it and run the integration test
            yield runTests({ extensionDevelopmentPath, extensionTestsPath });
        }
        catch (err) {
            console.error('Failed to run tests', err);
            process.exit(1);
        }
    });
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJ1blRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRWpELFNBQWUsSUFBSTs7UUFDbEIsSUFBSTtZQUNILDREQUE0RDtZQUM1RCx5Q0FBeUM7WUFDekMsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUVuRSwwQkFBMEI7WUFDMUIsaUNBQWlDO1lBQ2pDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFcEUsMERBQTBEO1lBQzFELE1BQU0sUUFBUSxDQUFDLEVBQUUsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1NBQ2pFO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7SUFDRixDQUFDO0NBQUE7QUFFRCxJQUFJLEVBQUUsQ0FBQyJ9