/**
 * A project folder the Pour Tracker can be given without a person to pick one.
 *
 * The tool keeps its records in a folder on the visitor's disk, chosen through
 * the browser's folder picker (`showDirectoryPicker`). That is a native dialog
 * no test can answer, and the browser's private file system that could stand
 * in for a real folder refuses a page opened from `file://`. So the picker is
 * replaced, before the tool loads, with one that hands over a folder held in
 * memory — enough of the File System Access API for the tool to create its
 * records file in, write to and read back.
 *
 * It is passed to `addInitScript` whole, so it must not close over anything:
 * the browser receives its source, not the function.
 */
export function provideProjectFolder() {
  class FileHandle {
    readonly kind = 'file';
    private contents = new Blob([]);
    constructor(readonly name: string) {}

    async getFile() {
      return new File([this.contents], this.name);
    }

    async createWritable(options?: { keepExistingData?: boolean }) {
      let parts: BlobPart[] = options?.keepExistingData ? [this.contents] : [];
      return {
        write: async (data: BlobPart | { type: string; data?: BlobPart }) => {
          if (typeof data === 'object' && data !== null && 'type' in data && !(data instanceof Blob)) {
            if (data.type === 'write' && data.data !== undefined) parts.push(data.data);
            return;
          }
          parts.push(data as BlobPart);
        },
        // Whole-file writes are all the tool was seen to make. Anything finer
        // says so rather than writing a file the test would then trust.
        seek: async () => {
          throw new Error('The test folder does not seek within a file.');
        },
        truncate: async (size: number) => {
          if (size !== 0) throw new Error('The test folder only empties a file.');
          parts = [];
        },
        close: async () => {
          this.contents = new Blob(parts);
        },
        abort: async () => {},
      };
    }

    async queryPermission() {
      return 'granted';
    }
    async requestPermission() {
      return 'granted';
    }
  }

  class DirectoryHandle {
    readonly kind = 'directory';
    private children = new Map<string, FileHandle | DirectoryHandle>();
    constructor(readonly name: string) {}

    private child<T>(name: string, create: boolean | undefined, Kind: new (name: string) => T): T {
      let entry = this.children.get(name);
      if (!entry) {
        if (!create) throw new DOMException(`${name} was not found`, 'NotFoundError');
        entry = new Kind(name) as FileHandle | DirectoryHandle;
        this.children.set(name, entry);
      }
      if (!(entry instanceof Kind)) throw new DOMException(`${name} is the wrong kind`, 'TypeMismatchError');
      return entry;
    }

    async getFileHandle(name: string, options?: { create?: boolean }) {
      return this.child(name, options?.create, FileHandle);
    }
    async getDirectoryHandle(name: string, options?: { create?: boolean }) {
      return this.child(name, options?.create, DirectoryHandle);
    }
    async *entries() {
      yield* this.children.entries();
    }
    [Symbol.asyncIterator]() {
      return this.entries();
    }
    async queryPermission() {
      return 'granted';
    }
    async requestPermission() {
      return 'granted';
    }
  }

  const folder = new DirectoryHandle('Tower-A');
  Object.assign(window, {
    showDirectoryPicker: async () => folder,
    /** What the tool wrote to its records file, for a test to read back. */
    readProjectRecords: async () => (await (await folder.getFileHandle('concrete_db.json')).getFile()).text(),
  });
}
