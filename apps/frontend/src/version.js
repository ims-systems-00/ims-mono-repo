
    let currentV = '(v4.0.0)'
    function getCurretVersion() {
      return currentV
    }
    let version = {
      get: getCurretVersion
    }
    export default version
    