#!/bin/bash

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo bash -c 'cat > /etc/google-cloud-ops-agent/config.yaml <<END_OF_FILE
logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /var/log/myapp.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: time
      time_format: "%Y-%m-%dT%H:%M:%S.%L%Z"    
    move_severity:
      type: modify_fields
      fields:
        severity:
          move_from: jsonPayload.level
  service:
    pipelines:
      default_pipeline:
        receivers: [my-app-receiver]
        processors: [my-app-processor, move_severity]
END_OF_FILE'

sudo systemctl restart google-cloud-ops-agent