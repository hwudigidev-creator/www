import packageJson from '../../package.json'

function VersionInfo() {
  return (
    <div className="version-info">
      v{packageJson.version}
    </div>
  )
}

export default VersionInfo
