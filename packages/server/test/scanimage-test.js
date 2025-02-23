/* eslint-env mocha */
const assert = require('assert');
const Context = require('../src/context');
const Device = require('../src/device');
const FileInfo = require('../src/file-info');
const Request = require('../src/request');
const Scanimage = require('../src/scanimage');

const requestScan = {
  params: {
    deviceId: 'deviceId',
    resolution: '150',
    format: 'TIF',
    isPreview: false
  }
};

const requestPreview = {
  params: {
    deviceId: 'deviceId',
    resolution: '150',
    format: 'TIF',
    isPreview: true
  }
};

function commandFor(version, request) {
  const temp = Scanimage.scanimage._version;
  Scanimage.scanimage._version = version;
  const command = Scanimage.scan(request);
  Scanimage.scanimage._version = temp;
  return command;
}

describe('ScanimageCommand', () => {
  it('scanimageVersion:1.0.27:scan', () => {
    const command = commandFor('1.0.27', requestScan);
    assert.ok(command.match(/.*scanimage.* > 'data\/temp\/~tmp-scan-0-ined.tif'/));
  });

  it('scanimageVersion:1.0.27:preview', () => {
    const command = commandFor('1.0.27', requestPreview);
    assert.ok(command.match(/.*scanimage.* > 'data\/preview\/preview.tif'/));
  });

  it('scanimageVersion:1.0.28:scan', () => {
    const command = commandFor('1.0.28', requestScan);
    assert.ok(command.match(/.*scanimage.* -o 'data\/temp\/~tmp-scan-0-ined.tif'/));
  });

  it('scanimageVersion:1.0.28:preview', () => {
    const command = commandFor('1.0.28', requestPreview);
    assert.ok(command.match(/.*scanimage.* -o 'data\/preview\/preview.tif'/));
  });

  it('scanimageVersion:1.0.31:scan', () => {
    const command = commandFor('1.0.31', requestScan);
    assert.ok(command.match(/.*scanimage.* -o 'data\/temp\/~tmp-scan-0-ined.tif'/));
  });

  it('scanimageVersion:1.0.31:preview', () => {
    const command = commandFor('1.0.31', requestPreview);
    assert.ok(command.match(/.*scanimage.* -o 'data\/preview\/preview.tif'/));
  });

  it('scanimage-a10.txt', () => {
    const file = FileInfo.create('test/resource/scanimage-a10.txt');
    const device = Device.from(file.toText());
    const context = new Context([device]);
    const request = new Request(context).extend({
      params: {
        mode: 'Color'
      }
    });
    const command = commandFor('1.0.31', request);

    // eslint-disable-next-line quotes
    assert.strictEqual(command, `/usr/bin/scanimage -d 'epjitsu:libusb:001:003' --mode 'Color' --source 'ADF Front' --resolution 300 --page-width 215.8 --page-height 292 -t 0 --format 'tiff' --brightness 0 --contrast 0 -o 'data/temp/~tmp-scan-0-0001.tif'`);
  });
});
